"use client";

import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadCloud, XCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (fileDataUri: string, fileName: string) => void;
  acceptedMimeTypes?: string[];
  maxFileSizeMB?: number; // Max file size in MB
}

export function FileUpload({ 
  onFileSelect, 
  acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSizeMB = 5 
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!acceptedMimeTypes.includes(file.type)) {
        setError(`Invalid file type. Please upload one of: ${acceptedMimeTypes.join(', ')}`);
        setPreview(null);
        setFileName(null);
        event.target.value = ''; // Clear the input
        return;
      }

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${maxFileSizeMB}MB.`);
        setPreview(null);
        setFileName(null);
        event.target.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFileName(file.name);
        onFileSelect(result, file.name);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setPreview(null);
        setFileName(null);
      }
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setFileName(null);
    }
  }, [onFileSelect, acceptedMimeTypes, maxFileSizeMB]);

  const clearSelection = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    // Reset the input field value
    const input = document.getElementById('file-upload-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:border-primary transition-colors">
        {!preview && (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary" />
            <p className="mb-2 text-sm text-muted-foreground group-hover:text-primary">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedMimeTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} (MAX. {maxFileSizeMB}MB)
            </p>
          </div>
        )}
        <Input
          id="file-upload-input"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={acceptedMimeTypes.join(',')}
        />
        {preview && (
          <>
            <Image 
              src={preview} 
              alt={fileName || "Preview"} 
              layout="fill" 
              objectFit="contain" 
              className="rounded-lg p-2"
              data-ai-hint="uploaded image" 
            />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 p-1 bg-card/70 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              aria-label="Clear selection"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      {fileName && !error && (
        <Alert variant="default" className="bg-secondary border-primary/30">
          <AlertDescription className="text-primary">
            Selected file: {fileName}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
