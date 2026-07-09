interface SectionHeadingProps {
  title: string;
  description?: string;
  id?: string;
  step?: number;
}

export function SectionHeading({ title, description, id, step }: SectionHeadingProps): JSX.Element {
  return (
    <div className="mb-8 flex items-start gap-4">
      {step !== undefined && (
        <div className="icon-box-muted hidden h-10 w-10 flex-shrink-0 sm:flex">
          <span className="font-display text-sm font-bold">{String(step).padStart(2, '0')}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        {step !== undefined && <p className="section-label sm:hidden">Step {step}</p>}
        <h2 id={id} className="font-display text-xl font-bold tracking-tight text-body sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        )}
      </div>
    </div>
  );
}
