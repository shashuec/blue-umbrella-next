import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv-safe';

// Load environment variables from .env.local
try {
  if (process.env.NODE_ENV !== 'production') {
    // Override dotenv-safe to use .env.local specifically and allow empty values
    dotenv.config({
      allowEmptyValues: true,
      path: '.env.local',
      example: '.env.example'
    });
    
    // Debug environment variables (redacted for security)
    console.log('Environment loaded successfully:');
    console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
} catch (err) {
  console.warn('Warning: Error loading .env.local file', err);
}

// Initialize Supabase client - can be used on the client side
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Initialize Supabase admin client - only use on server-side routes
// This has the service role key which bypasses Row Level Security
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Check if we're in testing mode
export const isTestMode = () => {
  if (typeof process !== 'undefined') {
    // Only use test mode if explicitly set to true
    const testMode = process.env.IS_TESTING_MODE === 'true';
    console.log('Test mode:', testMode);
    return testMode;
  }
  return false;
};

// Create Supabase Storage helper functions
export const supabaseStorage = {
  /**
   * Upload a file to Supabase Storage
   * @param file File to upload
   * @param bucketName Bucket name (default: 'portfolio-uploads')
   * @param path Optional path within the bucket
   * @returns Upload result with URL
   */
  async uploadFile(file: File | Blob, bucketName: string = 'portfolio-uploads', path?: string): Promise<{ 
    url: string; 
    path: string;
  }> {
    // Return mock data in test mode
    if (isTestMode()) {
      const filename = path || `test-${Date.now()}.pdf`;
      return {
        url: `https://mock-storage-url.com/${bucketName}/${filename}`,
        path: `${bucketName}/${filename}`
      };
    }
    
    try {
      // Check if bucket exists
      const { data: buckets } = await supabaseAdmin
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.find(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating bucket '${bucketName}'...`);
        const { error: bucketError } = await supabaseAdmin
          .storage
          .createBucket(bucketName, {
            public: false,
            fileSizeLimit: 10485760, // 10MB in bytes
          });
        
        if (bucketError) {
          console.error('Failed to create bucket:', bucketError);
        } else {
          console.log(`Bucket '${bucketName}' created successfully`);
        }
      } else {
        console.log(`Bucket '${bucketName}' already exists`);
      }
    } catch (bucketCreationError) {
      console.error('Error managing bucket:', bucketCreationError);
    }
    
    const filename = path || `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`;
    
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .upload(filename, file, {
        upsert: false,
        contentType: 'application/pdf',
      });
    
    if (error) throw error;

    const { data: urlData } = await supabaseAdmin
      .storage
      .from(bucketName)
      .createSignedUrl(data.path, 60 * 60 * 24); // 24 hours expiry
    
    return { 
      url: urlData?.signedUrl || '', 
      path: data.path 
    };
  },

  /**
   * Generate a signed URL for a file
   * @param path Path to the file
   * @param bucketName Bucket name (default: 'portfolio-uploads')
   * @param expiresIn Expiry time in seconds (default: 24 hours)
   * @returns Signed URL
   */
  async getSignedUrl(path: string, bucketName: string = 'portfolio-uploads', expiresIn: number = 60 * 60 * 24): Promise<string> {
    // Return mock URL in test mode
    if (isTestMode()) {
      return `https://mock-storage-url.com/${bucketName}/${path}?signed=true&expires=${Date.now() + expiresIn * 1000}`;
    }
    
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    
    return data.signedUrl;
  },

  /**
   * Download a file from Supabase Storage
   * @param path Path to the file
   * @param bucketName Bucket name (default: 'portfolio-uploads')
   * @returns File data
   */
  async downloadFile(path: string, bucketName: string = 'portfolio-uploads'): Promise<Blob> {
    // Return mock data in test mode
    if (isTestMode()) {
      // Create a simple PDF blob with some sample content
      const mockPdfContent = `%PDF-1.5
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R 
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length 173 >>
stream
BT
/F1 24 Tf
100 700 Td
(TEST PORTFOLIO DOCUMENT) Tj
/F1 12 Tf
0 -50 Td
(Fund 1: Equity Large Cap - Value: $150,000 - Return: 12%) Tj
0 -20 Td
(Fund 2: Debt - Value: $100,000 - Return: 8%) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000300 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
526
%%EOF
`;
      return new Blob([mockPdfContent], { type: 'application/pdf' });
    }
    
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .download(path);
    
    if (error || !data) throw error || new Error('Failed to download file');
    
    return data;
  }
};

// Initialize Twilio client
export const initTwilioClient = () => {
  const twilio = require('twilio');
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};
