import { NextRequest, NextResponse } from 'next/server';
import { updateAnalysisStatus } from '../status/route';
import { v4 as uuidv4 } from 'uuid';

// In a real implementation, we would use a database
// For this demo, we'll use the same in-memory store from the upload route
// This should be in a shared file or database in production
declare const uploadStore: Record<string, {
  fileData: any,
  timestamp: number,
  phoneNumber?: string,
  verified?: boolean,
  status?: 'pending' | 'processing' | 'completed' | 'failed',
  progress?: number,
  stage?: string,
  otp?: string,
  analysisId?: string,
  insights?: {
    summary: string,
    currentValue: number,
    annualReturn: number,
    riskLevel: string,
    assetCount: number,
    recommendations: string[],
    allocation: {
      equity: number,
      debt: number,
      gold: number,
      others: number
    }
  }
}>;

export async function POST(request: NextRequest) {
  try {
    const { uploadId } = await request.json();
    
    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }
    
    const uploadData = uploadStore[uploadId];
    
    if (!uploadData) {
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 400 }
      );
    }
    
    // Check if the phone number is verified
    if (!uploadData.verified) {
      return NextResponse.json(
        { error: 'Phone number not verified' },
        { status: 400 }
      );
    }
    
    // Create an analysis ID
    const analysisId = uuidv4();
    
    // Start processing
    uploadStore[uploadId] = {
      ...uploadData,
      status: 'processing',
      progress: 0,
      stage: 'parsing',
      analysisId
    };
    
    // Initialize the analysis status
    updateAnalysisStatus(analysisId, {
      status: 'processing',
      progress: 0
    });
    
    // In a real app, we would call OpenAI or other AI service for processing
    // For this demo, we'll simulate processing with a timeout
    
    // This would be a background job in a real app
    // We're simulating here with a setTimeout (not good for production)
    setTimeout(() => {
      // Simulate parsing stage (30% of progress)
      const analysisId = uploadStore[uploadId].analysisId!;
      updateAnalysisStatus(analysisId, {
        status: 'processing',
        progress: 30,
        result: { stage: 'parsing' }
      });
      
      setTimeout(() => {
        // Simulate analyzing stage (60% of progress)
        updateAnalysisStatus(analysisId, {
          status: 'processing',
          progress: 60,
          result: { stage: 'analyzing' }
        });
        
        setTimeout(() => {
          // Simulate generating stage (90% of progress)
          updateAnalysisStatus(analysisId, {
            status: 'processing',
            progress: 90,
            result: { stage: 'generating' }
          });
          
          setTimeout(() => {
            // Add sample insights data
            const insights = {
              summary: "Your portfolio shows a balanced approach with moderate risk. There's room for improvement in diversification and potential for higher returns with some adjustments.",
              currentValue: 1250000,
              annualReturn: 11.5,
              riskLevel: "Moderate",
              assetCount: 8,
              recommendations: [
                "Consider increasing equity allocation by 10% to improve long-term returns",
                "Rebalance debt funds to reduce duration risk in rising interest rate environment",
                "Add international exposure (5-10%) to improve diversification",
                "Consolidate similar funds to reduce overlap and management fees"
              ],
              allocation: {
                equity: 45,
                debt: 40,
                gold: 10,
                others: 5
              }
            };
            
            // Complete processing
            updateAnalysisStatus(analysisId, {
              status: 'completed',
              progress: 100,
              result: insights
            });
            
            // Update upload store as well
            uploadStore[uploadId].insights = insights;
            uploadStore[uploadId].status = 'completed';
            uploadStore[uploadId].progress = 100;
          }, 3000);
        }, 3000);
      }, 3000);
    }, 1000);
    
    // Return immediate success response with analysis ID
    return NextResponse.json({
      success: true,
      message: 'Processing started',
      analysisId: uploadStore[uploadId].analysisId
    });
    
  } catch (error) {
    console.error('Error starting processing:', error);
    
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    );
  }
}
