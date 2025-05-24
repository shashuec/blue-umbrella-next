"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

const ReviewPage = () => {
  // Define the steps in the review process
  const STEPS = {
    UPLOAD: 0,
    UPLOADING: 1,
    PHONE: 2,
    OTP: 3,
    CONFIRMATION: 4,
  };
  
  const [step, setStep] = useState(STEPS.UPLOAD);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Portfolio Review
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Get a free expert analysis of your current investment portfolio
            </p>
          </div>

          <Card className="p-6 bg-white shadow-md rounded-lg">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Upload your portfolio</h3>
              <p className="text-sm text-gray-500">
                Please upload your investment portfolio statement as a PDF file (max 10MB)
              </p>
              
              {/* Upload box will go here in the full implementation */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors border-gray-300">
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
              
              <Link href="/">
                <Button className="w-full">
                  Continue
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReviewPage;
