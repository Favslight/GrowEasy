interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps): JSX.Element {
  return (
    <div className="dashboard-card border-rose-200/60 p-5 sm:p-6 dark:border-rose-500/20" role="alert">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-glow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-body">Something went wrong</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-secondary border-rose-200 text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
