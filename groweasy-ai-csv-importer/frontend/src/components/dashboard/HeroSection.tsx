interface HeroSectionProps {
  onImportClick: () => void;
  onLearnMoreClick: () => void;
}

const features = [
  'Any CSV format',
  'AI field mapping',
  'Instant preview',
  'CRM-ready export',
];

export function HeroSection({ onImportClick, onLearnMoreClick }: HeroSectionProps): JSX.Element {
  return (
    <section className="dashboard-section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-light dark:bg-mesh-dark" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10"
        aria-hidden="true"
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-up text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="badge-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-soft" aria-hidden="true" />
              AI-powered import
            </span>
          </div>

          <h1 className="font-display mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-body sm:text-5xl lg:text-[3.25rem]">
            Turn messy CSVs into{' '}
            <span className="gradient-text">clean CRM records</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
            LeadSense intelligently parses, maps, and extracts structured lead data from any export —
            so your team spends less time cleaning and more time closing.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <button type="button" onClick={onImportClick} className="btn-primary px-7 py-3.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Import your CSV
            </button>
            <button type="button" onClick={onLearnMoreClick} className="btn-secondary px-7 py-3.5">
              See how it works
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block">
          <div className="animate-float relative mx-auto max-w-md">
            <div className="dashboard-card overflow-hidden p-1 shadow-glow">
              <div className="rounded-xl bg-surface-muted p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs text-subtle">leads_export.csv</span>
                </div>
                <div className="space-y-2 font-mono text-[10px] leading-relaxed text-subtle">
                  <p className="text-brand-600 dark:text-brand-400">name,email,phone,company...</p>
                  <p>John Doe,john@acme.com,555-0100,Acme Inc</p>
                  <p>Jane Smith,jane@corp.io,555-0101,Corp.io</p>
                  <p className="text-subtle/60">+ 847 more rows</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 dashboard-card w-56 p-4 shadow-glow">
              <div className="flex items-center gap-3">
                <div className="icon-box-muted h-10 w-10">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-body">AI Extraction</p>
                  <p className="text-[11px] text-muted">849 CRM records ready</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
