-- Database schema for Blue Umbrella Next
-- Create tables and policies for Supabase

-- Enable Row Level Security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create portfolio uploads bucket
-- Execute this in SQL Editor in Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('portfolio-uploads', 'portfolio-uploads', false);

-- Create review_sessions table
CREATE TABLE IF NOT EXISTS public.review_sessions (
    id UUID PRIMARY KEY,
    upload_path TEXT NOT NULL,
    upload_url TEXT NOT NULL,
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress SMALLINT DEFAULT 0,
    stage TEXT,
    result JSONB,
    error TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create phone_otps table for OTP verification
CREATE TABLE IF NOT EXISTS public.phone_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT NOT NULL,
    session_id UUID NOT NULL REFERENCES public.review_sessions(id) ON DELETE CASCADE,
    otp_code TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_review_sessions_phone_number ON public.review_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_review_sessions_status ON public.review_sessions(status);
CREATE INDEX IF NOT EXISTS idx_phone_otps_session_id ON public.phone_otps(session_id);
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone_session ON public.phone_otps(phone_number, session_id);

-- Enable Row Level Security on tables
ALTER TABLE public.review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Create storage bucket policies

-- Policy: Allow users to upload files to the portfolio-uploads bucket
CREATE POLICY "Allow uploads to portfolio bucket"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'portfolio-uploads' AND
    auth.role() = 'authenticated'
);

-- Policy: Allow users to read their own files from the portfolio-uploads bucket
CREATE POLICY "Allow download of own portfolio files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'portfolio-uploads' AND
    (auth.uid() = owner OR auth.role() = 'service_role')
);

-- Policy: Only allow service role to insert review sessions
CREATE POLICY "Service role can insert review sessions"
ON public.review_sessions FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Users can read their own review sessions
CREATE POLICY "Service role can read review sessions"
ON public.review_sessions FOR SELECT 
TO service_role
USING (true);

-- Policy: Only allow service role to update review sessions
CREATE POLICY "Service role can update review sessions"
ON public.review_sessions FOR UPDATE
TO service_role
USING (true);

-- Policy: Only allow service role to manage phone OTPs
CREATE POLICY "Service role can manage phone OTPs"
ON public.phone_otps
TO service_role
USING (true);

-- Function to check rate limits based on IP address
CREATE OR REPLACE FUNCTION check_upload_rate_limit(ip_address TEXT, max_uploads INTEGER DEFAULT 5, hours INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count
    FROM public.review_sessions
    WHERE 
        review_sessions.ip_address = check_upload_rate_limit.ip_address AND
        review_sessions.created_at > NOW() - (hours * INTERVAL '1 hour');
        
    RETURN count < max_uploads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
