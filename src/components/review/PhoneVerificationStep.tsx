"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendOTP } from "@/lib/api";

interface PhoneVerificationStepProps {
  onPhoneVerified: (phoneNumber: string) => void;
  uploadId: string;
  onBack: () => void;
}

interface FormValues {
  phoneNumber: string;
}

export const PhoneVerificationStep = ({ onPhoneVerified, uploadId, onBack }: PhoneVerificationStepProps) => {
  const [countdown, setCountdown] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>();
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Phone verification mutation
  const phoneVerificationMutation = useMutation({
    mutationFn: (phoneNumber: string) => sendOTP(phoneNumber, uploadId),
    onSuccess: () => {
      toast.success("Verification code sent");
      setCountdown(30); // Start a 30-second countdown
      onPhoneVerified(getValues("phoneNumber"));
    },
    onError: (error) => {
      toast.error(`Failed to send verification code: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
  
  const onSubmit = (data: FormValues) => {
    phoneVerificationMutation.mutate(data.phoneNumber);
  };
  
  // Phone number validation
  const validatePhoneNumber = (value: string) => {
    if (!value) return "Phone number is required";
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    
    if (digitsOnly.length < 10) {
      return "Please enter a valid phone number with at least 10 digits";
    }
    
    return true;
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Verify Your Phone</h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ll send a verification code to your phone
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="(123) 456-7890"
            {...register("phoneNumber", {
              validate: validatePhoneNumber
            })}
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            type="submit" 
            disabled={phoneVerificationMutation.isPending || countdown > 0}
          >
            {phoneVerificationMutation.isPending 
              ? "Sending..." 
              : countdown > 0 
                ? `Resend in ${countdown}s` 
                : "Send Verification Code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};