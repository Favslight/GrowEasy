'use client';

import { useMemo, useState } from 'react';
import type { SkippedRecord } from '@/types/csv';

interface SkippedRecordsSectionProps {
  records: SkippedRecord[];
}

const renderText = (value: string): JSX.Element => (
  <span className={value ? 'text-body' : 'text-subtle'}>{value || '—'}</span>
);

export function SkippedRecordsSection({ records }: SkippedRecordsSectionProps): JSX.Element | null {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [record.name, record.email, record.mobile, record.reason]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [records, search]);

  if (records.length === 0) {
    return null;
  }

  return (
    <section className="dashboard-section" aria-labelledby="skipped-records-heading">
      <div className="dashboard-card overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-muted/30 sm:px-6"
          aria-expanded={open}
          aria-controls="skipped-records-panel"
        >
          <div className="flex items-center gap-4">
            <div className="icon-box-muted h-10 w-10 flex-shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h2 id="skipped-records-heading" className="font-display text-lg font-bold text-body">
                Skipped records
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                {records.length.toLocaleString()} rows excluded with reasons
              </p>
            </div>
          </div>
          <svg
            className={`h-5 w-5 flex-shrink-0 text-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {open && (
          <div id="skipped-records-panel" className="border-t border-subtle">
            <div className="px-5 py-4 sm:px-6">
              <label htmlFor="skipped-search" className="sr-only">
                Search skipped records
              </label>
              <input
                id="skipped-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search skipped records..."
                className="dashboard-input max-w-md"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    {['Original row', 'Reason', 'Raw data preview'].map((header) => (
                      <th key={header} scope="col" className="table-header">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr key={`${record.email}-${record.mobile}-${index}`} className="border-b border-subtle">
                      <td className="table-cell">
                        <div className="space-y-1">
                          <p className="font-medium text-body">{renderText(record.name)}</p>
                          <p className="text-xs text-muted">{renderText(record.email)}</p>
                          <p className="text-xs text-muted">{renderText(record.mobile)}</p>
                        </div>
                      </td>
                      <td className="table-cell">{renderText(record.reason)}</td>
                      <td className="table-cell">
                        <code className="block max-w-md truncate rounded-lg bg-surface-muted px-3 py-2 font-mono text-xs text-muted">
                          {JSON.stringify(record)}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
