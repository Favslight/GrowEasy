'use client';

import { useEffect, useRef, useState } from 'react';
import type { CrmRecord, SkippedRecord } from '@/types/csv';
import {
  exportRecordsAsCsv,
  exportRecordsAsJson,
  exportSkippedAsCsv,
  exportSkippedAsJson,
} from '@/lib/export';

interface ExportDropdownProps {
  records: CrmRecord[];
  skipped: SkippedRecord[];
  filename: string;
}

export function ExportDropdown({ records, skipped, filename }: ExportDropdownProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseName = filename.replace(/\.csv$/i, '') || 'leadsense-export';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type: 'records-csv' | 'records-json' | 'skipped-csv' | 'skipped-json'): void => {
    if (type === 'records-csv') exportRecordsAsCsv(records, `${baseName}-records.csv`);
    if (type === 'records-json') exportRecordsAsJson(records, `${baseName}-records.json`);
    if (type === 'skipped-csv') exportSkippedAsCsv(skipped, `${baseName}-skipped.csv`);
    if (type === 'skipped-json') exportSkippedAsJson(skipped, `${baseName}-skipped.json`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="btn-primary px-5 py-2.5"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl border border-subtle bg-surface-elevated p-1.5 shadow-card dark:shadow-card-dark"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-subtle">CRM records</p>
          <button type="button" role="menuitem" onClick={() => handleExport('records-csv')} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-surface-muted">
            Export CSV
          </button>
          <button type="button" role="menuitem" onClick={() => handleExport('records-json')} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-surface-muted">
            Export JSON
          </button>
          {skipped.length > 0 && (
            <>
              <div className="my-1 border-t border-subtle" />
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-subtle">Skipped</p>
              <button type="button" role="menuitem" onClick={() => handleExport('skipped-csv')} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-surface-muted">
                Skipped CSV
              </button>
              <button type="button" role="menuitem" onClick={() => handleExport('skipped-json')} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-surface-muted">
                Skipped JSON
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
