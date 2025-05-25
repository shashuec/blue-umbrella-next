"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { FileUploadStep } from "@/components/review/FileUploadStep";
import { PhoneVerificationStep } from "@/components/review/PhoneVerificationStep";
import { OTPInputStep } from "@/components/review/OTPInputStep";
import { InsightsProgress } from "@/components/review/InsightsProgress";
import { InsightsResult } from "@/components/review/InsightsResult";
import { startAnalysis } from "@/lib/api";
import { PortfolioAnalysis } from "@/types/api";

const ReviewPage = () => {
  // Define the steps in the review process
  const STEPS = {
    UPLOAD: 0,
    PHONE: 1,
    OTP: 2,
    PROCESSING: 3,
    RESULT: 4,
  };
  
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [insights, setInsights] = useState<PortfolioAnalysis | null>(null);
  
  // Handler for successful file upload
  const handleFileUploaded = async (id: string) => {
    setUploadId(id);
    // Skip phone verification and start analysis directly
    try {
      toast.info("Starting portfolio analysis...");
      const result = await startAnalysis(id);
      setAnalysisId(result.analysisId);
      setStep(STEPS.PROCESSING);
    } catch (error) {
      console.error("Error starting analysis:", error);
      toast.error("Failed to start analysis");
    }
  };
  
  // Handler for phone verification
  const handlePhoneVerified = (phone: string) => {
    setPhoneNumber(phone);
    setStep(STEPS.OTP);
  };
  
  // Handler for OTP verification and process start
  const handleOTPVerified = async () => {
    try {
      if (!uploadId) {
        toast.error("No portfolio uploaded");
        return;
      }
      const result = await startAnalysis(uploadId);
      setAnalysisId(result.analysisId);
      setStep(STEPS.PROCESSING);
    } catch (error) {
      toast.error(`Failed to start analysis: ${error instanceof Error ? error.message : "Unknown error"}`);
      console.error("Error starting portfolio analysis:", error);
    }
  };
  
  // Handler for analysis completion
  const handleAnalysisComplete = (result: PortfolioAnalysis) => {
    setInsights(result);
    setStep(STEPS.RESULT);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              AI-Powered Mutual Fund Portfolio Review
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Get a free expert analysis of your current mutual fund investment portfolio using our advanced AI technology
            </p>
          </div>

          <Card className="p-6 bg-white shadow-md rounded-lg">
            <div className="space-y-6">
              {step === STEPS.UPLOAD && (
                <FileUploadStep onFileUploaded={handleFileUploaded} />
              )}
              
              {/* Phone and OTP steps are skipped - verification requirement removed */}
              
              {step === STEPS.PROCESSING && analysisId && (
                <InsightsProgress
                  uploadId={analysisId}
                  onComplete={handleAnalysisComplete}
                />
              )}
              
              {step === STEPS.RESULT && insights && (
                <InsightsResult
                  insights={insights}
                  onRestart={() => setStep(STEPS.UPLOAD)}
                />
              )}
              
              <div className="mt-2 text-center">
                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Powered by advanced AI technology
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      {/* <Footer /> removed to prevent duplicate rendering; it is already in the layout */}
    </div>
  );
};

export default ReviewPage;
