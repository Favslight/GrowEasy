'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { importCsv } from '@/services/api';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { useProcessingTimeline } from '@/hooks/useProcessingTimeline';
import { UploadCard } from '@/components/upload/UploadCard';
import { SummaryCards } from '@/components/preview/SummaryCards';
import { PreviewTable } from '@/components/preview/PreviewTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HowItWorks } from '@/components/HowItWorks';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { SectionHeading } from '@/components/dashboard/SectionHeading';
import { ProcessingTimeline } from '@/components/dashboard/ProcessingTimeline';
import { ResultsOverview } from '@/components/dashboard/ResultsOverview';
import { SuccessBanner } from '@/components/dashboard/SuccessBanner';
import { ErrorCard } from '@/components/dashboard/ErrorCard';
import { SkippedRecordsSection } from '@/components/dashboard/SkippedRecordsSection';
import { ExportDropdown } from '@/components/dashboard/ExportDropdown';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import type { ImportResponse } from '@/types/csv';

const CrmRecordsTable = dynamic(
  () => import('@/components/dashboard/CrmRecordsTable').then((mod) => mod.CrmRecordsTable),
  {
    loading: () => (
      <div className="dashboard-card flex items-center justify-center gap-3 px-6 py-16 text-sm text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        Loading CRM records...
      </div>
    ),
  },
);

export default function Home(): JSX.Element {
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);

  const uploadRef = useRef<HTMLElement>(null);
  const learnMoreRef = useRef<HTMLDivElement>(null);
  const processingStartedAt = useRef<number | null>(null);

  const { file, data, fileMeta, error, isParsing, uploadFile, reset } = useCsvUpload();

  const { isStageComplete, activeStage, reset: resetTimeline } = useProcessingTimeline({
    hasFile: fileMeta !== null,
    hasPreview: data !== null,
    isProcessing,
    isComplete: importResult !== null && !isProcessing,
  });

  const scrollTo = useCallback((element: HTMLElement | null): void => {
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleFileAccepted = useCallback(
    (acceptedFile: File): void => {
      setRejectionMessage(null);
      setImportResult(null);
      setUploadError(null);
      setShowSuccessBanner(false);
      setProcessingTimeMs(null);
      resetTimeline();
      void uploadFile(acceptedFile);
    },
    [uploadFile, resetTimeline],
  );

  const handleFileRejected = useCallback(
    (message: string): void => {
      reset();
      setImportResult(null);
      setUploadError(null);
      setShowSuccessBanner(false);
      setProcessingTimeMs(null);
      resetTimeline();
      setRejectionMessage(message);
    },
    [reset, resetTimeline],
  );

  const handleRemove = useCallback((): void => {
    reset();
    setRejectionMessage(null);
    setImportResult(null);
    setUploadError(null);
    setShowSuccessBanner(false);
    setProcessingTimeMs(null);
    resetTimeline();
  }, [reset, resetTimeline]);

  const handleConfirm = useCallback(async (): Promise<void> => {
    if (!file || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setUploadError(null);
    setImportResult(null);
    setShowSuccessBanner(false);
    processingStartedAt.current = performance.now();

    try {
      const result = await importCsv(file);
      const endedAt = performance.now();
      setProcessingTimeMs(
        processingStartedAt.current !== null ? Math.round(endedAt - processingStartedAt.current) : null,
      );
      setImportResult(result);
      setShowSuccessBanner(true);
    } catch (caughtError) {
      setUploadError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The server could not process this file. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing]);

  const activeError = error ?? (rejectionMessage ? { code: 'INVALID_TYPE' as const, message: rejectionMessage } : null);

  return (
    <div className="relative min-h-screen bg-page">
      <div className="pointer-events-none fixed inset-0 bg-mesh-light dark:bg-mesh-dark" aria-hidden="true" />

      <SiteHeader
        onUploadClick={() => scrollTo(uploadRef.current)}
        onLearnMoreClick={() => scrollTo(learnMoreRef.current)}
      />

      <main className="relative mx-auto space-y-20 px-4 py-12 sm:space-y-24 sm:px-6 sm:py-16 lg:px-8">
        <HeroSection
          onImportClick={() => scrollTo(uploadRef.current)}
          onLearnMoreClick={() => scrollTo(learnMoreRef.current)}
        />

        <section ref={uploadRef} className="dashboard-section" aria-labelledby="upload-heading">
          <SectionHeading
            id="upload-heading"
            step={1}
            title="Upload your file"
            description="Drop in any CSV export — we handle the column mapping automatically."
          />
          <UploadCard
            onFileAccepted={handleFileAccepted}
            onFileRejected={handleFileRejected}
            onRemove={handleRemove}
            isParsing={isParsing}
            error={activeError}
            fileMeta={fileMeta}
          />
        </section>

        <section className="dashboard-section" aria-labelledby="preview-heading">
          <SectionHeading
            id="preview-heading"
            step={2}
            title="Preview your data"
            description="Review rows and columns before sending to AI extraction."
          />

          {data && fileMeta ? (
            <div className="space-y-6">
              <SummaryCards data={data} fileMeta={fileMeta} />
              <PreviewTable data={data} />

              <div className="dashboard-card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="icon-box-muted h-10 w-10">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-body">Ready for extraction</p>
                    <p className="text-sm text-muted">
                      {data.rows.length.toLocaleString()} rows · {data.headers.length} columns detected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleConfirm()}
                  disabled={isProcessing}
                  aria-busy={isProcessing}
                  className="btn-primary w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                      Confirm & extract
                    </>
                  )}
                </button>
              </div>

              {uploadError && <ErrorCard message={uploadError} onRetry={() => void handleConfirm()} />}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        <ProcessingTimeline
          isVisible={isProcessing || (importResult !== null && !uploadError)}
          isStageComplete={isStageComplete}
          activeStage={activeStage}
        />

        {importResult && !isProcessing && (
          <div className="space-y-20 sm:space-y-24">
            {showSuccessBanner && (
              <section className="dashboard-section">
                <SuccessBanner
                  imported={importResult.summary.imported}
                  skipped={importResult.summary.skipped}
                  onDismiss={() => setShowSuccessBanner(false)}
                />
              </section>
            )}

            <ResultsOverview
              summary={importResult.summary}
              csvRows={data?.rows.length ?? 0}
              csvColumns={data?.headers.length ?? 0}
              processingTimeMs={processingTimeMs}
            />

            <section className="dashboard-section" aria-labelledby="crm-records-heading">
              <SectionHeading
                id="crm-records-heading"
                title="CRM records"
                description="Browse, search, and inspect structured records extracted by AI."
              />
              <CrmRecordsTable records={importResult.records} />
            </section>

            <SkippedRecordsSection records={importResult.skipped} />

            <section className="dashboard-section" aria-labelledby="downloads-heading">
              <div className="dashboard-card relative overflow-hidden p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" aria-hidden="true" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="icon-box-muted h-12 w-12 flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </div>
                    <div>
                      <h2 id="downloads-heading" className="font-display text-lg font-bold text-body">
                        Export your results
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        Download CRM records and skipped rows in CSV or JSON format.
                      </p>
                    </div>
                  </div>
                  <ExportDropdown
                    records={importResult.records}
                    skipped={importResult.skipped}
                    filename={importResult.filename}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        <div ref={learnMoreRef}>
          <HowItWorks />
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
