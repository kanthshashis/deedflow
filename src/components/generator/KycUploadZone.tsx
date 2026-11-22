"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, FileCheck, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { KycExtractionResult } from "@/lib/types";

interface KycUploadZoneProps {
  onExtracted: (result: KycExtractionResult) => void;
}

export function KycUploadZone({ onExtracted }: KycUploadZoneProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage("Compressing image client-side (max 1280px)...");

    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const compressedBlob = await downscaleImage(file, 1280, 0.85);

      setStatusMessage("Calling in-memory Gemini 2.5 Flash OCR...");

      const formData = new FormData();
      formData.append("file", compressedBlob, file.name);

      const response = await fetch("/api/ocr/kyc", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract KYC fields");
      }

      const data: KycExtractionResult = await response.json();
      setStatusMessage("Extraction verified! Aadhaar masked.");
      onExtracted(data);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || "Failed to process"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Buyer KYC In-Memory OCR</h3>
            <p className="text-xs text-slate-500">Upload or snap photo of PAN Card, Aadhaar, or Passport</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero-Retention Privacy</span>
        </div>
      </div>

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-[#E5E7EB] hover:border-emerald-600 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-emerald-50/20 spring-snap flex flex-col items-center justify-center space-y-3 group transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="KYC Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[11px] font-bold">
              Click to replace
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 spring-snap">
            <Upload className="w-5 h-5" />
          </div>
        )}

        <div className="text-xs">
          <span className="font-bold text-slate-900 group-hover:text-emerald-700 spring-snap">
            Click to upload KYC photo
          </span>{" "}
          <span className="text-slate-500">or drag &amp; drop here</span>
          <p className="text-[11px] text-slate-400 font-mono mt-1">JPEG, PNG, WebP up to 10MB</p>
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{statusMessage}</span>
          </div>
        )}

        {!isProcessing && statusMessage && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Client-side image downscaling
async function downscaleImage(file: File, maxDim: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas toBlob failed"));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
