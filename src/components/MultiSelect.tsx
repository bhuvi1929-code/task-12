import { useState, useRef, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown } from 'lucide-react';
import styles from '../styles/multiselect.module.css';

interface MultiSelectProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
}

export default function MultiSelect({ label, options, selectedValues, onChange, icon }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectAll = () => onChange(options.map(o => o.value));
  const clearAll = () => onChange([]);

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>{label}</label>
      <div 
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(!isOpen); }}
      >
        <div className={styles.triggerContent}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={`${styles.text} ${selectedValues.length > 0 ? styles.textActive : ''}`}>
            {selectedValues.length === 0 
              ? 'Select...' 
              : selectedValues.length === 1
                ? (options.find(o => o.value === selectedValues[0])?.label || selectedValues[0])
                : `${selectedValues.length} Selected`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selectedValues.length > 1 && (
            <span className={styles.badge}>{selectedValues.length}</span>
          )}
          <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.actions}>
            <button type="button" onClick={selectAll} className={styles.actionBtn}>Select All</button>
            <button type="button" onClick={clearAll} className={styles.actionBtn}>Clear</button>
          </div>
          <div className={styles.optionsList}>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div 
                  key={option.value} 
                  className={styles.option}
                  onClick={() => toggleOption(option.value)}
                >
                  {isSelected ? (
                    <CheckSquare size={16} className={styles.checkboxChecked} />
                  ) : (
                    <Square size={16} className={styles.checkboxUnchecked} />
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
