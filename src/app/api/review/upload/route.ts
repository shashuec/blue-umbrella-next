import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabaseStorage, isTestMode } from '@/lib/supabase';
import DB from '@/lib/db';

const RATE_LIMIT = Number(process.env.RATE_LIMIT_UPLOADS) || 5;
 
export async function POST(request: NextRequest) {
  // Set CORS headers for API routes
  const origin = request.headers.get('origin') || '';
  const headers = new Headers({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers, status: 204 });
  }
  
  try {
    console.log('Upload API route called, test mode:', isTestMode());
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }
    
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown-ip';

    // Check rate limit
    try {
      const uploadCount = await DB.reviewSessions.countByIp(ip);
      if (uploadCount >= RATE_LIMIT) {
        return NextResponse.json(
          { error: `Rate limit exceeded. Maximum ${RATE_LIMIT} uploads per hour.` },
          { status: 429 }
        );
      }
    } catch (e) {
      console.error('Rate limit check error:', e);
      // Continue anyway if rate limit check fails
    }
    
    // Generate a unique ID for this upload
    const sessionId = uuidv4();
    
    try {
      // Check for test mode
      const testMode = process.env.IS_TESTING_MODE === 'true';
      console.log('Upload handler running in', testMode ? 'TEST MODE' : 'NORMAL MODE');
      
      // Upload file to Supabase Storage
      const filename = `${sessionId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('Attempting to upload file:', filename);
      
      const { url, path } = await supabaseStorage.uploadFile(file, 'portfolio-uploads', filename);
      console.log('Upload successful, path:', path);
      
      // Create review session in the database
      console.log('Creating review session in database');
      await DB.reviewSessions.create({
        id: sessionId,
        upload_path: path,
        upload_url: url,
        status: 'pending',
        progress: 0,
      });
      
      // Return success response with sessionId and signed URL
      return NextResponse.json({ 
        uploadId: sessionId,
        url,
        success: true, 
        message: 'File uploaded successfully' 
      });
      
    } catch (storageError) {
      console.error('Supabase storage error:', storageError);
      // Return more detailed error message
      return NextResponse.json(
        { 
          error: 'Failed to store file', 
          details: storageError.message || 'Unknown error',
          message: 'Please check if your Supabase storage bucket "portfolio-uploads" exists'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
