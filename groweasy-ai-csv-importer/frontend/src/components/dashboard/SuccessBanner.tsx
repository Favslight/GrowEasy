interface SuccessBannerProps {
  imported: number;
  skipped: number;
  onDismiss: () => void;
}

export function SuccessBanner({ imported, skipped, onDismiss }: SuccessBannerProps): JSX.Element {
  return (
    <div
      className="dashboard-card relative overflow-hidden border-emerald-200/60 p-5 sm:p-6 dark:border-emerald-500/20"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-50/80 via-transparent to-brand-50/40 dark:from-emerald-950/30 dark:to-brand-950/20" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-glow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-body">Import complete</h3>
            <p className="mt-1 text-sm text-muted">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {imported.toLocaleString()} CRM records
              </span>{' '}
              extracted successfully.
              {skipped > 0 && ` ${skipped.toLocaleString()} records were skipped.`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="btn-ghost rounded-lg p-1.5"
          aria-label="Dismiss success message"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
