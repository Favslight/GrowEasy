import { formatFileSize } from '@/lib/csv';
import type { CsvFileMeta, ParsedCsv } from '@/types/csv';

interface SummaryCardsProps {
  data: ParsedCsv;
  fileMeta: CsvFileMeta;
}

interface SummaryItem {
  label: string;
  value: string;
  icon: JSX.Element;
  accent: string;
}

export function SummaryCards({ data, fileMeta }: SummaryCardsProps): JSX.Element {
  const items: SummaryItem[] = [
    {
      label: 'Rows',
      value: data.rows.length.toLocaleString(),
      accent: 'from-brand-500 to-violet-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      ),
    },
    {
      label: 'Columns',
      value: data.headers.length.toLocaleString(),
      accent: 'from-violet-500 to-purple-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
      ),
    },
    {
      label: 'Filename',
      value: fileMeta.name,
      accent: 'from-blue-500 to-brand-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      ),
    },
    {
      label: 'File size',
      value: formatFileSize(fileMeta.size),
      accent: 'from-emerald-500 to-teal-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="dashboard-card-interactive flex items-center gap-4 p-4">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-glow-sm`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              {item.icon}
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-subtle">{item.label}</p>
            <p className="truncate font-display text-base font-bold text-body" title={item.value}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
