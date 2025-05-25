import { NextRequest, NextResponse } from 'next/server';

// Mock process API for testing
export async function POST(request: NextRequest) {
  try {
    const { uploadId } = await request.json();
    
    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`⚙️ MOCK API: Processing started for ${uploadId}`);
    
    // For testing, we'll use the same ID as analysis ID
    const analysisId = uploadId;
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Mock processing started',
      analysisId
    });
    
  } catch (error) {
    console.error('Error in mock process:', error);
    
    return NextResponse.json(
      { error: 'Mock processing failed' },
      { status: 500 }
    );
  }
}
