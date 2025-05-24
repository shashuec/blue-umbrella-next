import { ApiResponse, AnalysisData } from "@/types/api";

// API endpoints
export const API_ROUTES = {
  UPLOAD: '/api/review/upload',
  VERIFY_PHONE: '/api/review/verify-phone',
  CONFIRM_OTP: '/api/review/confirm-otp',
  PROCESS: '/api/review/process',
  STATUS: '/api/review/status',
} as const;

// Upload a portfolio file
export async function uploadPortfolio(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_ROUTES.UPLOAD, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  return response.json();
}

// Send OTP to phone number
export async function sendOTP(phoneNumber: string, uploadId: string) {
  const response = await fetch(API_ROUTES.VERIFY_PHONE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, uploadId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send OTP');
  }

  return response.json();
}

// Verify OTP
export async function verifyOTP(otp: string, uploadId: string, phoneNumber: string) {
  const response = await fetch(API_ROUTES.CONFIRM_OTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ otp, uploadId, phoneNumber }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to verify OTP');
  }

  return response.json();
}

// Start portfolio analysis process
export async function startAnalysis(uploadId: string) {
  const response = await fetch(API_ROUTES.PROCESS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uploadId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start analysis');
  }

  return response.json();
}

// Check analysis status
export async function checkAnalysisStatus(analysisId: string): Promise<ApiResponse<AnalysisData>> {
  const response = await fetch(`${API_ROUTES.STATUS}?id=${analysisId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check analysis status');
  }

  return response.json();
}
