import React, { useState, useEffect } from 'react';
import { Bookmark, Tag, Save, X } from 'lucide-react';
import styles from '../styles/modal.module.css';
import type { DashboardFilters } from '../types';

interface SaveViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  filters: DashboardFilters;
}

export default function SaveViewModal({ isOpen, onClose, onSave, filters }: SaveViewModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a view name.');
      return;
    }
    onSave(name.trim());
    onClose();
  };

  // Extract active filter labels for preview
  const activeKeys = ['department', 'role', 'location', 'status', 'risk', 'skills', 'experience'].filter(
    k => Array.isArray(filters[k]) && (filters[k] as string[]).length > 0
  );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconBadge}>
            <Bookmark size={20} />
          </div>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>Save Custom View</h3>
            <p className={styles.subtitle}>Save your active filters as a preset for quick access later.</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>View Name</label>
            <div className={styles.inputWrapper}>
              <Tag size={16} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="e.g., Engineering High Risk"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          {activeKeys.length > 0 && (
            <div className={styles.filterPreview}>
              <span className={styles.previewTitle}>Included Filters ({activeKeys.length}):</span>
              <div className={styles.previewChips}>
                {activeKeys.map(k => (
                  <span key={k} className={styles.previewChip}>
                    {k}: {(filters[k] as string[]).join(', ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={15} /> Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
