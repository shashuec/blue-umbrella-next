import { NextRequest, NextResponse } from 'next/server';

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
  otp?: string
}>;

export async function POST(request: NextRequest) {
  try {
    const { otp, uploadId, phoneNumber } = await request.json();
    
    if (!otp || !uploadId || !phoneNumber) {
      return NextResponse.json(
        { error: 'OTP, upload ID, and phone number are required' },
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
    
    // Verify that this is the same phone number that requested the OTP
    if (uploadData.phoneNumber !== phoneNumber.replace(/\D/g, '')) {
      return NextResponse.json(
        { error: 'Phone number mismatch' },
        { status: 400 }
      );
    }
    
    // Check if the OTP matches
    if (uploadData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }
    
    // Mark as verified
    uploadStore[uploadId] = {
      ...uploadData,
      verified: true
    };
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
