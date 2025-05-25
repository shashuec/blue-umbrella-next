import { NextRequest, NextResponse } from 'next/server';
import DB from '@/lib/db';
import { initTwilioClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, uploadId } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
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
    
    // Check if session exists
    const session = await DB.reviewSessions.getById(uploadId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 400 }
      );
    }
    
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      // Store OTP in the database
      await DB.phoneOTPs.create(cleanPhone, uploadId, otp);
      
      // Send OTP via Twilio
      if (process.env.NODE_ENV === 'production') {
        try {
          const twilioClient = initTwilioClient();
          await twilioClient.messages.create({
            body: `Your Blue Umbrella verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+${cleanPhone}`
          });
        } catch (twilioError) {
          console.error('Twilio error:', twilioError);
          return NextResponse.json(
            { error: 'Failed to send SMS' },
            { status: 500 }
          );
        }
      } else {
        // Log OTP in development environment
        console.log(`DEV MODE: OTP for ${cleanPhone} is ${otp}`);
      }
      
      // Update the session with phone number
      await DB.reviewSessions.update(uploadId, {
        phone_number: cleanPhone
      });
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully'
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store OTP data' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
