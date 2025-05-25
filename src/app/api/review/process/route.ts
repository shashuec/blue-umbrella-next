import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import DB from '@/lib/db';
import { supabaseStorage, isTestMode } from '@/lib/supabase';
import { getAIClient } from '@/lib/ai-client';
import pdfParse from 'pdf-parse';

// PDF processing function
async function processPdfContent(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF content');
  }
}

// Portfolio analysis function with AI client
async function analyzePortfolio(pdfText: string) {
  try {
    // Get AI client (Azure OpenAI or mock)
    const aiClient = await getAIClient();
    
    // Analyze portfolio using AI
    console.log('Analyzing portfolio text...');
    return await aiClient.analyzePortfolio(pdfText);
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    throw new Error('Failed to analyze portfolio');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uploadId } = await request.json();
    
    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the session exists
    const session = await DB.reviewSessions.getById(uploadId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 400 }
      );
    }
    
    // NOTE: OTP verification requirement removed temporarily
    // Auto-mark as verified if not already verified
    if (!session.phone_verified) {
      console.log('Auto-verifying session without OTP check');
      await DB.reviewSessions.update(uploadId, {
        phone_verified: true
      });
    }
    
    // Create an analysis ID (can use the same ID as the session)
    const analysisId = uploadId;
    
    // Update the session status to processing
    await DB.reviewSessions.update(uploadId, {
      status: 'processing',
      progress: 10,
      stage: 'parsing'
    });
    
    // This would be handled by a background job in production
    // For demo purposes, we're doing it in the request handler (not recommended for production)
    
    // Start an async process without waiting for it to complete
    (async () => {
      try {
        // Step 1: Download the file
        try {
          // Update progress
          await DB.reviewSessions.update(uploadId, {
            progress: 30,
            stage: 'parsing'
          });
          
          // Download the PDF from Supabase Storage
          const pdfBlob = await supabaseStorage.downloadFile(session.upload_path);
          const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
          
          // Step 2: Parse the PDF
          const pdfText = await processPdfContent(pdfBuffer);
          
          // Update progress
          await DB.reviewSessions.update(uploadId, {
            progress: 50,
            stage: 'analyzing'
          });
          
          // Step 3: Analyze with OpenAI
          const insights = await analyzePortfolio(pdfText);
          
          // Update progress
          await DB.reviewSessions.update(uploadId, {
            progress: 90,
            stage: 'generating'
          });
          
          // Step 4: Save the results
          await DB.reviewSessions.update(uploadId, {
            status: 'completed',
            progress: 100,
            result: insights
          });
          
        } catch (downloadError) {
          console.error('Error downloading or processing file:', downloadError);
          await DB.reviewSessions.update(uploadId, {
            status: 'failed',
            error: 'Failed to process portfolio file'
          });
        }
      } catch (processError) {
        console.error('Process error:', processError);
        await DB.reviewSessions.update(uploadId, {
          status: 'failed',
          error: 'Analysis process failed'
        });
      }
    })();
    
    // Return immediate success response with analysis ID
    return NextResponse.json({
      success: true,
      message: 'Processing started',
      analysisId
    });
    
  } catch (error) {
    console.error('Error starting processing:', error);
    
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    );
  }
}
