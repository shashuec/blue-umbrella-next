"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileUploadStepProps {
  onFileUploaded: (uploadId: string, file: File) => void;
}

interface FormValues {
  file: FileList;
}

export const FileUploadStep: React.FC<FileUploadStepProps> = ({ onFileUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm<FormValues>();
  const selectedFile = watch("file")?.[0];

  // File upload mutation with progress tracking
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);

      // Make request with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise<{data: { uploadId: string, filename: string }}>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(xhr.statusText || 'Upload failed'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };

        // Send the request
        xhr.open('POST', '/api/review/upload', true);
        xhr.send(formData);
      });
    },
    onSuccess: (data) => {
      setUploadProgress(100);
      toast.success("Portfolio uploaded successfully");
      const fileFromForm = getValues("file")[0];
      onFileUploaded(data.data.uploadId, fileFromForm);
    },
    onError: () => {
      toast.error(`Upload failed`);
      setUploadProgress(0);
    }
  });

  const onSubmit = (data: FormValues) => {
    const file = data.file[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  // Handle drag and drop events
  const handleDrag = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Trigger the file input change
      const fileInputElement = document.getElementById("file") as HTMLInputElement;
      if (fileInputElement) {
        fileInputElement.files = dataTransfer.files;
        // Trigger a change event
        const event = new Event("change", { bubbles: true });
        fileInputElement.dispatchEvent(event);
      }
    }
  };

  // Validate file type and size
  const validateFile = (files: FileList) => {
    if (files.length === 0) return "Please select a file";
    
    const file = files[0];
    if (!file.type.includes("pdf")) {
      return "Only PDF files are allowed";
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB";
    }
    
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto max-w-2xl px-4 space-y-8">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-semibold text-gray-900">Upload your portfolio</h3>
        <p className="text-sm text-gray-500">
          Please upload your investment portfolio statement as a PDF file (max 10MB)
        </p>
      </div>
      
      {/* Drag and drop area */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="min-h-[300px] flex items-center justify-center"
      >
        <label
          htmlFor="file"
          className={`w-full h-full cursor-pointer flex flex-col items-center justify-center border-2 
                    ${dragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} 
                    ${selectedFile ? "border-green-500 bg-green-50" : ""} 
                    rounded-lg p-8 text-center hover:border-blue-500 hover:shadow-lg 
                    transition-all duration-200 ease-in-out`}
        >
          <div className="space-y-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="space-y-2">
              <p>
                <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                {" or drag and drop"}
              </p>
              <input
                id="file"
                type="file"
                className="sr-only"
                accept=".pdf"
                {...register("file", {
                  validate: validateFile
                })}
              />
              <p className="text-sm text-gray-500">PDF up to 10MB</p>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4">
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-800 border-blue-200 text-sm">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </Badge>
            </div>
          )}
        </label>
      </div>
      
      {errors.file && (
        <p className="text-sm text-red-500 text-center">{errors.file.message as string}</p>
      )}
      
      {/* Upload progress bar (when active) */}
      {uploadMutation.isPending && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full sm:w-auto sm:min-w-[200px] sm:mx-auto block py-6 font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg" 
        disabled={!selectedFile || uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Uploading..." : "Continue"}
      </Button>
    </form>
  );
};
