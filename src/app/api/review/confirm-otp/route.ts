import { NextRequest, NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { otp, uploadId, phoneNumber } = await request.json();
    
    if (!otp || !uploadId || !phoneNumber) {
      return NextResponse.json(
        { error: 'OTP, upload ID, and phone number are required' },
        { status: 400 }
      );
    }
    
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if the session exists
    const session = await DB.reviewSessions.getById(uploadId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 400 }
      );
    }
    
    // Verify the OTP
    try {
      const isVerified = await DB.phoneOTPs.verify(cleanPhone, uploadId, otp);
      
      if (!isVerified) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
      
    } catch (dbError) {
      console.error('OTP verification error:', dbError);
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
