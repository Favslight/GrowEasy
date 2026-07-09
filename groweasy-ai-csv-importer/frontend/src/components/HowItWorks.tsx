interface Step {
  step: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    step: '01',
    title: 'Upload',
    description: 'Drop in any CSV export. Parsing happens instantly in your browser — nothing leaves until you confirm.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    ),
  },
  {
    step: '02',
    title: 'Preview',
    description: 'Review every row and column in a clean table. Verify your data looks right before extraction.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    ),
  },
  {
    step: '03',
    title: 'AI extraction',
    description: 'Confirm import and AI maps your columns into structured CRM records — name, email, status, and more.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    ),
  },
];

export function HowItWorks(): JSX.Element {
  return (
    <section id="how-it-works" className="dashboard-section scroll-mt-28" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-label">Workflow</p>
        <h2 id="how-it-works-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-body sm:text-4xl">
          Three steps to clean data
        </h2>
        <p className="mt-4 text-base text-muted">
          From raw spreadsheet to CRM-ready records in minutes — no manual mapping required.
        </p>
      </div>

      <ol className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent dark:via-brand-600/40 md:block" aria-hidden="true" />

        {steps.map((step) => (
          <li key={step.step} className="dashboard-card-interactive relative flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <div className="icon-box-muted h-12 w-12">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  {step.icon}
                </svg>
              </div>
              <span className="font-display text-sm font-bold text-subtle">{step.step}</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-body">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center text-sm text-subtle">
        AI extraction runs only after you review and confirm your import.
      </p>
    </section>
  );
}
