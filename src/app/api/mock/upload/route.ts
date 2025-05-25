import { NextRequest, NextResponse } from 'next/server';
import { mocks } from '@/lib/test-utils';
import { v4 as uuidv4 } from 'uuid';

// Mock API for testing without actual file upload
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { fileName } = data;
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      );
    }
    
    // Generate a test ID
    const uploadId = uuidv4();
    
    // Return success response
    return NextResponse.json({
      uploadId,
      url: `https://mock-url.com/${uploadId}/${fileName}`,
      success: true,
      message: 'Mock file upload successful'
    });
    
  } catch (error) {
    console.error('Error in mock upload:', error);
    
    return NextResponse.json(
      { error: 'Mock upload failed' },
      { status: 500 }
    );
  }
}
