import { supabaseAdmin } from './supabase';
import { PortfolioAnalysis } from '@/types/api';

// Check if we're in testing mode
export const isTestMode = () => {
  return process.env.IS_TESTING_MODE === 'true' || process.env.NODE_ENV === 'test';
};

// Interface for review sessions table
export interface ReviewSession {
  id: string;
  upload_path: string;
  upload_url: string;
  phone_number?: string;
  phone_verified: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  stage?: string;
  result?: PortfolioAnalysis;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Interface for phone OTP records
export interface PhoneOTP {
  id: string;
  phone_number: string;
  session_id: string;
  otp_code: string;
  verified: boolean;
  created_at: string;
  expires_at: string;
}

// Mock session for testing
const mockSession: ReviewSession = {
  id: 'test-session-id',
  upload_path: 'test/sample-portfolio.pdf',
  upload_url: 'https://mock-url.com/test-file.pdf',
  phone_number: null,
  phone_verified: false,
  status: 'pending',
  progress: 0,
  stage: null,
  result: null,
  error: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Store mock data for testing
const mockStore: Record<string, ReviewSession> = {
  'test-session-id': { ...mockSession }
};

const DB = {
  // Review Session Methods
  reviewSessions: {
    async create(data: Partial<ReviewSession>): Promise<ReviewSession> {
      // Return mock data if in test mode
      if (isTestMode()) {
        const mockId = data.id || 'test-session-id';
        const session = {
          ...mockSession,
          id: mockId,
          upload_path: data.upload_path || mockSession.upload_path,
          upload_url: data.upload_url || mockSession.upload_url,
          status: data.status || 'pending',
          progress: data.progress || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockStore[mockId] = session;
        return session;
      }

      // Regular DB operation
      const { data: session, error } = await supabaseAdmin
        .from('review_sessions')
        .insert({
          id: data.id,
          upload_path: data.upload_path,
          upload_url: data.upload_url,
          status: data.status || 'pending',
          progress: data.progress || 0,
          phone_verified: false,
        })
        .select('*')
        .single();

      if (error) throw error;
      return session;
    },

    async update(id: string, data: Partial<ReviewSession>): Promise<ReviewSession> {
      // Return mock data if in test mode
      if (isTestMode()) {
        if (!mockStore[id]) {
          mockStore[id] = {
            ...mockSession,
            id,
            updated_at: new Date().toISOString()
          };
        }
        
        mockStore[id] = {
          ...mockStore[id],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        return mockStore[id];
      }

      // Regular DB operation
      const { data: session, error } = await supabaseAdmin
        .from('review_sessions')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return session;
    },

    async getById(id: string): Promise<ReviewSession | null> {
      // Return mock data if in test mode
      if (isTestMode()) {
        // Always return a session in test mode, creating one if needed
        if (!mockStore[id]) {
          mockStore[id] = {
            ...mockSession,
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        return mockStore[id];
      }
      
      // Regular DB operation
      const { data, error } = await supabaseAdmin
        .from('review_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },

    async countByIp(ipAddress: string, hours: number = 1): Promise<number> {
      // Always return 0 in test mode to bypass rate limiting
      if (isTestMode()) {
        return 0;
      }
      
      // Regular DB operation
      const { count, error } = await supabaseAdmin
        .from('review_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ipAddress)
        .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return count || 0;
    }
  },

  // Phone OTP Methods
  phoneOTPs: {
    async create(phoneNumber: string, sessionId: string, otpCode: string): Promise<PhoneOTP> {
      // Return mock data if in test mode
      if (isTestMode()) {
        // Set session phone number in mock data
        if (mockStore[sessionId]) {
          mockStore[sessionId].phone_number = phoneNumber;
        }
        
        // Mock OTP record
        return {
          id: 'test-otp-id',
          phone_number: phoneNumber,
          session_id: sessionId,
          otp_code: otpCode,
          verified: false,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        };
      }
      
      // Set expiration to 10 minutes from now
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      const { data, error } = await supabaseAdmin
        .from('phone_otps')
        .insert({
          phone_number: phoneNumber,
          session_id: sessionId,
          otp_code: otpCode,
          verified: false,
          expires_at: expiresAt,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },

    async verify(phoneNumber: string, sessionId: string, otpCode: string): Promise<boolean> {
      // Always succeed in test mode with the test OTP code
      if (isTestMode()) {
        // In test mode, 1234 is always a valid OTP
        const isValid = otpCode === '1234';
        
        if (isValid && mockStore[sessionId]) {
          // Update the session mock data
          mockStore[sessionId].phone_number = phoneNumber;
          mockStore[sessionId].phone_verified = true;
          mockStore[sessionId].updated_at = new Date().toISOString();
        }
        
        return isValid;
      }
      
      // First check if there's an active OTP for this phone/session
      const { data, error } = await supabaseAdmin
        .from('phone_otps')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('session_id', sessionId)
        .eq('otp_code', otpCode)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return false;

      // Mark as verified
      const { error: updateError } = await supabaseAdmin
        .from('phone_otps')
        .update({ verified: true })
        .eq('id', data.id);

      if (updateError) throw updateError;

      // Update the session's phone verification status
      await supabaseAdmin
        .from('review_sessions')
        .update({ 
          phone_number: phoneNumber,
          phone_verified: true 
        })
        .eq('id', sessionId);

      return true;
    }
  }
};

export default DB;
