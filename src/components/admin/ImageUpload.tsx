'use client';

import { useRef, useState } from 'react';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string; // e.g. '16 / 10'
}

/**
 * Image upload field with drag-and-drop, preview, and an alternative
 * "paste URL" input. Uploads go to /api/admin/uploads which stores them
 * in Supabase Storage and returns the public URL.
 */
export default function ImageUpload({
  value,
  onChange,
  label,
  hint,
  aspectRatio = '16 / 10',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const pickFile = () => inputRef.current?.click();

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
      const body = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !body.url) {
        throw new Error(body.error ?? 'Upload failed');
      }
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Clear so selecting the same file again re-triggers onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {hint && <span className={styles.hint}>{hint}</span>}

      {value ? (
        <div className={styles.preview} style={{ aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className={styles.previewImg} />
          <div className={styles.previewActions}>
            <button
              type="button"
              onClick={pickFile}
              className={styles.actionBtn}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className={styles.spinner} /> Uploading…
                </>
              ) : (
                <>Replace</>
              )}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''}`}
          style={{ aspectRatio }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={pickFile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              pickFile();
            }
          }}
        >
          {uploading ? (
            <div className={styles.uploading}>
              <span className={styles.spinnerBig} />
              <span>Uploading…</span>
            </div>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div className={styles.dropzoneText}>
                <strong>Drop an image</strong> or click to browse
              </div>
              <div className={styles.dropzoneMeta}>
                JPG · PNG · WebP · GIF · SVG · AVIF — up to 5 MB
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      {error && <div className={styles.error}>{error}</div>}

      {/* ── URL fallback ─────────────────────────── */}
      <div className={styles.urlToggle}>
        {!showUrlInput ? (
          <button
            type="button"
            className={styles.urlLink}
            onClick={() => setShowUrlInput(true)}
          >
            Or paste an external URL
          </button>
        ) : (
          <div className={styles.urlRow}>
            <input
              type="url"
              className={styles.urlInput}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg or /projects/image.jpg"
            />
            <button
              type="button"
              className={styles.urlClose}
              onClick={() => setShowUrlInput(false)}
              aria-label="Hide URL input"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
