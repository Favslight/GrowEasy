'use client';

import { TIMELINE_STAGES, type TimelineStageId } from '@/hooks/useProcessingTimeline';

interface ProcessingTimelineProps {
  isVisible: boolean;
  isStageComplete: (stageId: TimelineStageId) => boolean;
  activeStage: TimelineStageId;
}

export function ProcessingTimeline({
  isVisible,
  isStageComplete,
  activeStage,
}: ProcessingTimelineProps): JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <section className="dashboard-section" aria-labelledby="processing-timeline-heading">
      <div className="dashboard-card overflow-hidden p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="icon-box h-10 w-10">
            <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          <div>
            <h2 id="processing-timeline-heading" className="font-display text-lg font-bold text-body">
              AI processing
            </h2>
            <p className="text-sm text-muted">Your import is moving through each extraction stage.</p>
          </div>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE_STAGES.map((stage) => {
            const complete = isStageComplete(stage.id);
            const active = stage.id === activeStage && !complete;

            return (
              <li
                key={stage.id}
                className={`relative rounded-xl border p-4 transition-all duration-500 ${
                  complete
                    ? 'border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-950/20'
                    : active
                      ? 'border-brand-300 bg-brand-50/50 shadow-glow-sm dark:border-brand-500/30 dark:bg-brand-950/30'
                      : 'border-subtle bg-surface-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                      complete
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface-muted text-subtle'
                    }`}
                    aria-hidden="true"
                  >
                    {complete ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : active ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold transition-colors duration-500 ${
                        complete ? 'text-emerald-700 dark:text-emerald-400' : active ? 'text-brand-700 dark:text-brand-300' : 'text-subtle'
                      }`}
                    >
                      {stage.label}
                    </p>
                    {active && (
                      <p className="mt-0.5 text-xs text-muted" role="status" aria-live="polite">
                        In progress...
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
