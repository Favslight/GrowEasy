'use client';

import { useEffect } from 'react';
import type { CrmRecord } from '@/types/csv';
import { formatDataSourceLabel, formatMobile, formatStatusLabel } from '@/lib/crm-display';

interface RecordDetailsDrawerProps {
  record: CrmRecord | null;
  onClose: () => void;
}

interface DetailSection {
  title: string;
  fields: { label: string; value: string }[];
}

const DetailField = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div className="rounded-xl border border-subtle bg-surface-muted/50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{label}</p>
    <p className="mt-1 text-sm text-body">{value || '—'}</p>
  </div>
);

export function RecordDetailsDrawer({ record, onClose }: RecordDetailsDrawerProps): JSX.Element | null {
  useEffect(() => {
    if (!record) {
      return;
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [record, onClose]);

  if (!record) {
    return null;
  }

  const sections: DetailSection[] = [
    {
      title: 'Lead information',
      fields: [
        { label: 'Name', value: record.name },
        { label: 'Created at', value: record.created_at },
        { label: 'Lead owner', value: record.lead_owner },
      ],
    },
    {
      title: 'Contact',
      fields: [
        { label: 'Email', value: record.email },
        {
          label: 'Mobile',
          value: formatMobile(record.country_code, record.mobile_without_country_code),
        },
        { label: 'Country code', value: record.country_code },
      ],
    },
    {
      title: 'Company & location',
      fields: [
        { label: 'Company', value: record.company },
        { label: 'City', value: record.city },
        { label: 'State', value: record.state },
        { label: 'Country', value: record.country },
      ],
    },
    {
      title: 'CRM',
      fields: [
        { label: 'CRM status', value: formatStatusLabel(record.crm_status) },
        { label: 'Data source', value: formatDataSourceLabel(record.data_source) },
        { label: 'Possession time', value: record.possession_time },
      ],
    },
    {
      title: 'Notes & description',
      fields: [
        { label: 'CRM note', value: record.crm_note },
        { label: 'Description', value: record.description },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="record-drawer-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close record details"
      />

      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-subtle bg-surface-elevated shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-subtle px-6 py-5">
          <div>
            <p className="section-label">Lead profile</p>
            <h2 id="record-drawer-title" className="font-display mt-1 text-lg font-bold text-body">
              {record.name || 'Unnamed lead'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost rounded-lg p-2" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-3 font-display text-sm font-bold text-body">{section.title}</h3>
                <div className="grid gap-3">
                  {section.fields.map((field) => (
                    <DetailField key={field.label} label={field.label} value={field.value} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
