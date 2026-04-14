'use client';

import { useRef, useState } from 'react';
import styles from './ImageListUpload.module.scss';

interface ImageListUploadProps {
  values: string[];
  onChange: (next: string[]) => void;
  hint?: string;
}

/**
 * Multi-image uploader: thumbnail grid with per-item remove + reorder,
 * one "+ Add images" button that accepts multiple files at once, and
 * a "paste URL" fallback for external images.
 */
export default function ImageListUpload({
  values,
  onChange,
  hint,
}: ImageListUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const pickFiles = () => inputRef.current?.click();

  const uploadOne = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
    const body = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };
    if (!res.ok || !body.url) {
      throw new Error(body.error ?? `Could not upload ${file.name}`);
    }
    return body.url;
  };

  const uploadMany = async (files: File[]) => {
    setError(null);
    setUploading(true);
    const added: string[] = [];
    try {
      for (const file of files) {
        try {
          const url = await uploadOne(file);
          added.push(url);
        } catch (err) {
          setError(err instanceof Error ? err.message : `Upload failed: ${file.name}`);
          break; // stop on first failure, but keep already-uploaded ones
        }
      }
      if (added.length) onChange([...values, ...added]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadMany(files);
    e.target.value = '';
  };

  const handleRemove = (i: number) =>
    onChange(values.filter((_, idx) => idx !== i));

  const move = (i: number, delta: number) => {
    const target = i + delta;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  const addUrl = () => {
    const clean = urlDraft.trim();
    if (!clean) return;
    onChange([...values, clean]);
    setUrlDraft('');
    setShowUrlInput(false);
  };

  return (
    <div className={styles.wrap}>
      {hint && <span className={styles.hint}>{hint}</span>}

      {values.length > 0 && (
        <div className={styles.grid}>
          {values.map((url, i) => (
            <div className={styles.item} key={`${url}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Screenshot ${i + 1}`} className={styles.itemImg} />
              <div className={styles.itemOverlay}>
                <div className={styles.reorder}>
                  <button
                    type="button"
                    className={styles.overlayBtn}
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.overlayBtn}
                    onClick={() => move(i, 1)}
                    disabled={i === values.length - 1}
                    aria-label="Move down"
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className={`${styles.overlayBtn} ${styles.overlayBtnDanger}`}
                  onClick={() => handleRemove(i)}
                  aria-label="Remove"
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
              <span className={styles.indexBadge}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={pickFiles}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className={styles.spinner} /> Uploading…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add images
            </>
          )}
        </button>

        {!showUrlInput ? (
          <button
            type="button"
            className={styles.urlLink}
            onClick={() => setShowUrlInput(true)}
          >
            Or paste URL
          </button>
        ) : (
          <div className={styles.urlRow}>
            <input
              type="url"
              className={styles.urlInput}
              placeholder="https://example.com/screenshot.jpg"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addUrl();
                }
              }}
              autoFocus
            />
            <button
              type="button"
              className={styles.urlAdd}
              onClick={addUrl}
              disabled={!urlDraft.trim()}
            >
              Add
            </button>
            <button
              type="button"
              className={styles.urlClose}
              onClick={() => {
                setShowUrlInput(false);
                setUrlDraft('');
              }}
              aria-label="Cancel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
