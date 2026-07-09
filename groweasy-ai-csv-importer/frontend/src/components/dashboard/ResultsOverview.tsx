import type { ImportSummary } from '@/types/csv';

interface ResultsOverviewProps {
  summary: ImportSummary;
  csvRows: number;
  csvColumns: number;
  processingTimeMs: number | null;
}

interface StatCard {
  label: string;
  value: number | string;
  helper: string;
  icon: JSX.Element;
  variant: 'brand' | 'success' | 'warning' | 'neutral';
}

const formatDuration = (ms: number | null): string => {
  if (ms === null) {
    return '—';
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
};

const variantStyles: Record<StatCard['variant'], string> = {
  brand: 'from-brand-500 to-violet-500',
  success: 'from-emerald-500 to-teal-500',
  warning: 'from-amber-500 to-orange-500',
  neutral: 'from-slate-500 to-slate-600',
};

export function ResultsOverview({
  summary,
  csvRows,
  csvColumns,
  processingTimeMs,
}: ResultsOverviewProps): JSX.Element {
  const cards: StatCard[] = [
    {
      label: 'Imported',
      value: summary.imported,
      helper: 'Successfully extracted by AI',
      variant: 'success',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      ),
    },
    {
      label: 'Skipped',
      value: summary.skipped,
      helper: 'Rows excluded during validation',
      variant: 'warning',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      ),
    },
    {
      label: 'Failed batches',
      value: summary.failedBatches,
      helper: 'Chunks that could not be processed',
      variant: 'neutral',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      ),
    },
    {
      label: 'CSV rows',
      value: csvRows,
      helper: 'Total rows in uploaded file',
      variant: 'brand',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      ),
    },
    {
      label: 'CSV columns',
      value: csvColumns,
      helper: 'Detected header fields',
      variant: 'brand',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
      ),
    },
    {
      label: 'Processing time',
      value: formatDuration(processingTimeMs),
      helper: 'End-to-end extraction duration',
      variant: 'neutral',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      ),
    },
  ];

  return (
    <section className="dashboard-section" aria-labelledby="results-overview-heading">
      <div className="mb-8">
        <p className="section-label">Results</p>
        <h2 id="results-overview-heading" className="font-display mt-2 text-2xl font-bold tracking-tight text-body sm:text-3xl">
          Extraction overview
        </h2>
        <p className="mt-2 text-sm text-muted sm:text-base">
          A snapshot of your import performance and extraction quality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="dashboard-card-interactive p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted">{card.label}</p>
                <p className="font-display mt-2 text-3xl font-bold tracking-tight text-body">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-subtle">{card.helper}</p>
              </div>
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${variantStyles[card.variant]} text-white shadow-glow-sm`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  {card.icon}
                </svg>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
