"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOTP } from "@/lib/api";

interface OTPInputStepProps {
  phoneNumber: string;
  uploadId: string;
  onOTPVerified: () => void;
  onBack: () => void;
}

export const OTPInputStep = ({ phoneNumber, uploadId, onOTPVerified, onBack }: OTPInputStepProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null]);

  const otpVerificationMutation = useMutation({
    mutationFn: async () => {
      const otpString = otp.join('');
      if (otpString.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }
      return verifyOTP(otpString, uploadId, phoneNumber);
    },
    onSuccess: async () => {
      toast.success("Phone number verified");
      await onOTPVerified();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (!/^\d*$/.test(pastedData)) return; // Only allow digits

    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
    
    // Focus last populated input or first empty input
    const lastIndex = Math.min(5, pastedOtp.length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Enter Verification Code</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit code to {phoneNumber}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => { inputRefs.current[index] = el; }}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => otpVerificationMutation.mutate()}
            disabled={otpVerificationMutation.isPending || otp.join('').length !== 6}
            className="w-full"
          >
            {otpVerificationMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
            disabled={otpVerificationMutation.isPending}
          >
            Back
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Didn&apos;t receive the code?{' '}
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
            disabled={otpVerificationMutation.isPending}
            onClick={() => toast.info("Resending code is not implemented in this demo")}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};