interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Parsing CSV...' }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10" role="status" aria-live="polite">
      <div className="relative">
        <span
          className="block h-12 w-12 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400"
          aria-hidden="true"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-soft" />
        </span>
      </div>
      <p className="text-sm font-medium text-muted">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
