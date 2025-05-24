"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkAnalysisStatus } from "@/lib/api";
import { ApiResponse, AnalysisData, PortfolioAnalysis } from "@/types/api";

interface InsightsProgressProps {
  uploadId: string;
  onComplete: (insights: PortfolioAnalysis) => void;
}

export const InsightsProgress = ({ uploadId, onComplete }: InsightsProgressProps) => {
  // Query to poll the status of the AI analysis
  const { data, error, isError } = useQuery<ApiResponse<AnalysisData>, Error>({
    queryKey: ["portfolio-status", uploadId],
    queryFn: () => checkAnalysisStatus(uploadId),
    refetchInterval: (query) => {
      // Stop polling once the analysis is complete or if there's an error
      const currentData = query.state.data;
      if (currentData?.data.status === "completed" || currentData?.data.status === "failed") {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    retry: 3, // Retry failed requests up to 3 times
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
  
  // Process status data
  useEffect(() => {
    if (data?.data.status === "completed" && data.data.result) {
      // Analysis completed successfully
      onComplete(data.data.result as PortfolioAnalysis);
    } else if (data?.data.status === "failed") {
      // Analysis failed
      toast.error("Analysis failed: " + (data.data.error || "Unknown error"));
    }
  }, [data, onComplete]);
  
  // Handle error in the query itself
  useEffect(() => {
    if (isError && error) {
      toast.error(`Error checking analysis status: ${error.message}`);
    }
  }, [isError, error]);
  
  // Calculate progress percentage based on status
  const getProgressPercentage = (): number => {
    if (!data?.data) return 5;
    if (data.data.status === "pending") return 10;
    if (data.data.status === "processing") return data.data.progress || 50;
    if (data.data.status === "completed") return 100;
    return 0;
  };
  
  // Get explanatory text based on status
  const getStatusText = (): string => {
    if (!data?.data) return "Initializing portfolio analysis...";
    if (data.data.status === "pending") return "Preparing your portfolio for analysis...";
    if (data.data.status === "processing") {
      const stage = data.data.result?.stage;
      if (stage === "parsing") return "Extracting data from your portfolio...";
      if (stage === "analyzing") return "Analyzing investment performance...";
      if (stage === "generating") return "Generating personalized insights...";
      return "Processing your portfolio data...";
    }
    if (data.data.status === "completed") return "Analysis complete!";
    if (data.data.status === "failed") return "Analysis failed. Please try again.";
    return "Processing your portfolio...";
  };
  
  if (isError) {
    return (
      <div className="text-center text-red-600 space-y-4">
        <h3 className="text-lg font-medium">Error</h3>
        <p className="text-sm">
          {error.message || "An error occurred while checking analysis status"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">
      <h3 className="text-lg font-medium text-gray-900">
        AI Analysis in Progress
      </h3>
      <p className="text-sm text-gray-600">
        Our AI is analyzing your portfolio to generate personalized insights
      </p>

      {/* Progress indicator */}
      <div className="w-full max-w-sm mx-auto space-y-4">
        <p className="text-sm font-medium text-gray-600">
          {getStatusText()}
        </p>
        
        <div className="relative w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              style={{ width: `${getProgressPercentage()}%` }}
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            />
          </div>
          <p className="text-xs font-semibold text-gray-600 text-right mt-1">
            {getProgressPercentage()}%
          </p>
        </div>
      </div>

      {/* Animated spinner */}
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>

      {/* Loading info */}
      <div className="text-sm text-gray-500">
        <p>This typically takes 1-2 minutes</p>
        <p className="mt-2 text-blue-600">Please wait while we analyze your portfolio...</p>
      </div>
    </div>
  );
};
