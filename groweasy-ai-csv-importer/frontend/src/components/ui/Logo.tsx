export function Logo({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="icon-box h-9 w-9 rounded-lg">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3L4 8v8l8 5 8-5V8l-8-5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M12 12l8-5M12 12v9M12 12L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="font-display text-lg font-bold tracking-tight text-body">
        Lead<span className="text-brand-600 dark:text-brand-400">Sense</span>
      </span>
    </div>
  );
}
