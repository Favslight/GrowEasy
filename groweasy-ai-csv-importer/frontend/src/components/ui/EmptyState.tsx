interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No preview yet',
  description = 'Upload a CSV file above to see a structured preview of your data.',
}: EmptyStateProps): JSX.Element {
  return (
    <div className="dashboard-card flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative">
        <div className="icon-box-muted h-16 w-16 rounded-2xl">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-brand-500 dark:border-[#12121a]" aria-hidden="true" />
      </div>
      <h3 className="font-display mt-6 text-lg font-bold text-body">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
