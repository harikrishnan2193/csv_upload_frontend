"use client";

import { useState, useRef } from "react";
import { uploadLargeFileWithProgress } from "../lib/api";

interface UploadProgress {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  status: string;
}

export default function LargeFileUpload() {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProgress(null);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
  if (!selectedFile) return;

  setIsUploading(true);
  setError(null);
  setProgress({ percentage: 0, uploadedBytes: 0, totalBytes: selectedFile.size, status: "starting" });

  try {
    const result = await uploadLargeFileWithProgress(selectedFile, (progressData) => {
      setProgress(progressData);
    });
    
    console.log('Upload result:', result); // Shows backend confirmation
    setIsUploading(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Upload failed");
    setIsUploading(false);
  }
};

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        padding: "32px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          border: "2px dashed #d1d5db",
          borderRadius: "8px",
          padding: "32px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <svg
            style={{
              margin: "0 auto",
              height: "48px",
              width: "48px",
              color: "#9ca3af",
              display: "block",
            }}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{ display: "none" }}
          id="large-file-upload"
        />
        <label htmlFor="large-file-upload" style={{ cursor: "pointer" }}>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Choose large file
          </span>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginTop: "4px",
              margin: "4px 0 0 0",
            }}
          >
            Videos, images, or any large files (1GB+)
          </p>
        </label>
      </div>

      {selectedFile && (
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: "#dcfce7",
                borderRadius: "50%",
                padding: "8px",
                marginRight: "12px",
              }}
            >
              <svg
                style={{ height: "20px", width: "20px", color: "#16a34a" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: "500", color: "#111827", margin: 0 }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            onClick={handleFileUpload}
            disabled={isUploading}
            style={{
              padding: "8px 24px",
              background: isUploading ? "#9ca3af" : "#2563eb",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: isUploading ? "not-allowed" : "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}

      {progress && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #e0e7ff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#1e40af",
              }}
            >
              Status: {progress.status}
            </span>
            <span style={{ fontSize: "14px", color: "#1e40af" }}>
              {formatBytes(progress.uploadedBytes)} / {formatBytes(progress.totalBytes)}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              background: "#e0e7ff",
              borderRadius: "4px",
              height: "8px",
            }}
          >
            <div
              style={{
                width: `${progress.percentage}%`,
                background: "#2563eb",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: "4px 0 0 0",
            }}
          >
            {progress.percentage}% complete
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
            Error: {error}
          </p>
        </div>
      )}
    </div>
  );
}
