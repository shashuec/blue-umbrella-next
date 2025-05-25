import { NextRequest, NextResponse } from 'next/server';
import { mocks, MOCK_OTP } from '@/lib/test-utils';

// Mock OTP confirmation API for testing
export async function POST(request: NextRequest) {
  try {
    const { otp, uploadId, phoneNumber } = await request.json();
    
    if (!otp || !uploadId || !phoneNumber) {
      return NextResponse.json(
        { error: 'OTP, upload ID, and phone number are required' },
        { status: 400 }
      );
    }
    
    // Check if OTP matches our test OTP
    if (otp !== MOCK_OTP) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }
    
    console.log(`🔑 MOCK API: OTP ${otp} verified for ${phoneNumber}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Mock OTP verified successfully'
    });
    
  } catch (error) {
    console.error('Error in mock OTP confirmation:', error);
    
    return NextResponse.json(
      { error: 'Mock OTP confirmation failed' },
      { status: 500 }
    );
  }
}
