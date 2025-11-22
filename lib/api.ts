import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadWithProgress = async (csvFile: File, onProgress: (progress: any) => void) => {
  const formData = new FormData();
  formData.append('csvFile', csvFile);
  
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
  
  const startResponse = await fetch(`${baseURL}/api/todos/bulk-upload`, {
    method: 'POST',
    body: formData
  });
  
  const { jobId } = await startResponse.json();
  
  const pollProgress = async (): Promise<any> => {
    const response = await fetch(`${baseURL}/api/todos/upload-status/${jobId}`);
    const progress = await response.json();
    
    onProgress(progress);
    
    if (progress.status === 'completed' || progress.status === 'failed') {
      return progress;
    }
    
    setTimeout(pollProgress, 1000);
  };
  
  return pollProgress();
};

export default api;
