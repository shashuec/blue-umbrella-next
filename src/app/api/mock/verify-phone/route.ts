import { NextRequest, NextResponse } from 'next/server';
import { mocks, MOCK_OTP } from '@/lib/test-utils';

// Mock phone verification API for testing
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, uploadId } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    console.log(`📱 MOCK API: Sending OTP ${MOCK_OTP} to ${phoneNumber}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Mock OTP sent successfully'
    });
    
  } catch (error) {
    console.error('Error in mock phone verification:', error);
    
    return NextResponse.json(
      { error: 'Mock phone verification failed' },
      { status: 500 }
    );
  }
}
