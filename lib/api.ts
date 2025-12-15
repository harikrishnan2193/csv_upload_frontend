import axios from "axios";


// upload function in lib
export const uploadLargeFileWithProgress = async (
  file: File,
  onProgress: (progress: { percentage: number; uploadedBytes: number; totalBytes: number; status: string }) => void
) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  const formData = new FormData();
  formData.append("file", file);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        onProgress({
          percentage,
          uploadedBytes: event.loaded,
          totalBytes: event.total,
          status: "uploading"
        });
      }
    });
    
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        onProgress({
          percentage: 100,
          uploadedBytes: file.size,
          totalBytes: file.size,
          status: "completed"
        });
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });
    
    xhr.open("POST", `${baseURL}/api/upload/large-file`);
    xhr.send(formData);
  });
};



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337",
  headers: {
    "Content-Type": "application/json",
  },
});

// api for upload csv data
export const uploadWithProgress = async (
  csvFile: File,
  onProgress: (progress: any) => void
) => {
  const formData = new FormData();
  formData.append("csvFile", csvFile);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  const startResponse = await fetch(`${baseURL}/api/todos/bulk-upload`, {
    method: "POST",
    body: formData,
  });

  const { jobId } = await startResponse.json();
  localStorage.setItem("activeJobId", jobId);

  return resumePolling(jobId, onProgress);
};

// api call for status progress
export const resumePolling = async (
  jobId: string,
  onProgress: (progress: any) => void
): Promise<any> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  const pollProgress = async (): Promise<any> => {
    const response = await fetch(`${baseURL}/api/todos/upload-status/${jobId}`);
    const progress = await response.json();

    onProgress(progress);

    if (progress.status === "completed" || progress.status === "failed") {
      localStorage.removeItem("activeJobId");
      await clearSession();
      return progress;
    }

    setTimeout(pollProgress, 1000);
  };

  return pollProgress();
};

// api for get current status
export const checkActiveSession = async (): Promise<any> => {
  const jobId = localStorage.getItem("activeJobId");
  if (!jobId) {
    return { hasActiveJob: false };
  }

  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const response = await fetch(`${baseURL}/api/todos/upload-status/${jobId}`);

    if (!response.ok) {
      localStorage.removeItem("activeJobId");
      return { hasActiveJob: false };
    }

    const progress = await response.json();

    if (progress.status === "completed" || progress.status === "failed") {
      localStorage.removeItem("activeJobId");
      return { hasActiveJob: false };
    }

    return {
      hasActiveJob: true,
      jobId,
      progress,
    };
  } catch (error) {
    localStorage.removeItem("activeJobId");
    return { hasActiveJob: false };
  }
};

// api call for clear session
export const clearSession = async (): Promise<void> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  await fetch(`${baseURL}/api/todos/clear-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export default api;
