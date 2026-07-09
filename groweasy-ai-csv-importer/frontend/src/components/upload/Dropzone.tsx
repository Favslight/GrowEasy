'use client';

import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { MAX_FILE_SIZE_BYTES } from '@/lib/csv';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  onFileRejected: (message: string) => void;
  disabled?: boolean;
}

export function Dropzone({ onFileAccepted, onFileRejected, disabled = false }: DropzoneProps): JSX.Element {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]): void => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const reason = rejection.errors[0];

        if (reason?.code === 'file-too-large') {
          onFileRejected('This file is larger than 10 MB. Please upload a smaller CSV file.');
        } else if (reason?.code === 'file-invalid-type') {
          onFileRejected('Only .csv files are supported. Please choose a valid CSV file.');
        } else {
          onFileRejected(reason?.message ?? 'This file could not be accepted. Please try another.');
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted, onFileRejected],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-xl border-2 border-dashed px-6 py-14 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#09090f] ${
        isDragReject
          ? 'border-rose-300 bg-rose-50/50 dark:border-rose-500/40 dark:bg-rose-950/20'
          : isDragActive
            ? 'border-brand-400 bg-brand-50/60 shadow-glow-sm dark:border-brand-500 dark:bg-brand-950/30'
            : 'border-subtle bg-surface-muted/50 hover:border-brand-300 hover:bg-brand-50/30 dark:hover:border-brand-500/40 dark:hover:bg-brand-950/20'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      aria-label="Upload a CSV file by dragging and dropping or browsing your computer"
    >
      <input {...getInputProps()} aria-label="CSV file input" />

      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/0 to-brand-500/5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />

      <div className="icon-box relative h-16 w-16 rounded-2xl transition-transform duration-300 group-hover:scale-105">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <div className="relative space-y-1.5">
        <p className="font-display text-base font-semibold text-body">
          {isDragActive ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
        </p>
        <p className="text-sm text-muted">
          or{' '}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              open();
            }}
            className="font-semibold text-brand-600 underline-offset-2 hover:underline focus:outline-none focus-visible:underline dark:text-brand-400"
          >
            browse files
          </button>
        </p>
      </div>

      <p className="badge relative">.csv only · Max 10 MB</p>
    </div>
  );
}
