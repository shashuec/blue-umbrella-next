import { NextRequest, NextResponse } from 'next/server';

// In a real implementation, we would use a database
// For this demo, we'll use the same in-memory store from the upload route
// This should be in a shared file or database in production
declare const uploadStore: Record<string, {
  fileData: unknown,
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
    const { phoneNumber, uploadId } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!uploadId || !uploadStore[uploadId]) {
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 400 }
      );
    }
    
    // Validate phone number (basic validation)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }
    
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // In a real app, we would send this via Twilio or similar service
    console.log(`Sending OTP ${otp} to ${cleanPhone}`);
    
    // Store the phone number and OTP with the upload
    uploadStore[uploadId] = {
      ...uploadStore[uploadId],
      phoneNumber: cleanPhone,
      otp,
      verified: false
    };
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
