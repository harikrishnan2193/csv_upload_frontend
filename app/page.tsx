'use client';

import { useState } from 'react';
import { uploadWithProgress } from '../lib/api';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCsv(selectedFile);
      setProgress(null);
    }
  };

  const parseCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      setCsvData(rows.filter(row => row.some(cell => cell.trim())));
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      await uploadWithProgress(file, (progressData) => {
        setProgress(progressData);
      });
    } catch (error) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '48px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            CSV Bulk Upload
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Upload and preview your CSV files
          </p>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <svg style={{ 
                margin: '0 auto', 
                height: '48px', 
                width: '48px', 
                color: '#9ca3af',
                display: 'block'
              }} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="csv-upload"
            />
            <label htmlFor="csv-upload" style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '18px', fontWeight: '500', color: '#374151' }}>
                Choose CSV file
              </span>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
                or drag and drop
              </p>
            </label>
          </div>
          
          {file && (
            <div style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f9fafb',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#dcfce7',
                  borderRadius: '50%',
                  padding: '8px',
                  marginRight: '12px'
                }}>
                  <svg style={{ height: '20px', width: '20px', color: '#16a34a' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                style={{
                  padding: '8px 24px',
                  background: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                {loading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </div>
          )}

          {progress && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #e0e7ff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e40af' }}>
                  Status: {progress.status}
                </span>
                <span style={{ fontSize: '14px', color: '#1e40af' }}>
                  {progress.processed || 0}/{progress.total || 0}
                </span>
              </div>
              <div style={{
                width: '100%',
                background: '#e0e7ff',
                borderRadius: '4px',
                height: '8px'
              }}>
                <div style={{
                  width: `${progress.progress || 0}%`,
                  background: '#2563eb',
                  height: '100%',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                {progress.progress || 0}% complete
              </p>
            </div>
          )}
        </div>

        {csvData.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                CSV Preview
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {csvData.length-1} items found
              </p>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {csvData.map((row, i) => (
                    <tr key={i} style={{
                      background: i === 0 ? '#dbeafe' : 'white',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: '12px 24px',
                          fontSize: '14px',
                          color: i === 0 ? '#1e3a8a' : '#111827',
                          fontWeight: i === 0 ? '600' : 'normal',
                          whiteSpace: 'nowrap'
                        }}>
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
