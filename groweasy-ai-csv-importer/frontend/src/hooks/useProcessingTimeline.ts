'use client';

import { useCallback, useEffect, useState } from 'react';

export type TimelineStageId =
  | 'upload'
  | 'parsed'
  | 'analyzed'
  | 'extraction'
  | 'validation'
  | 'ready';

export interface TimelineStage {
  id: TimelineStageId;
  label: string;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  { id: 'upload', label: 'Upload Completed' },
  { id: 'parsed', label: 'CSV Parsed' },
  { id: 'analyzed', label: 'Structure Analyzed' },
  { id: 'extraction', label: 'AI Extraction Complete' },
  { id: 'validation', label: 'Validation Complete' },
  { id: 'ready', label: 'Dashboard Ready' },
];

interface UseProcessingTimelineOptions {
  hasFile: boolean;
  hasPreview: boolean;
  isProcessing: boolean;
  isComplete: boolean;
}

export const useProcessingTimeline = ({
  hasFile,
  hasPreview,
  isProcessing,
  isComplete,
}: UseProcessingTimelineOptions) => {
  const [completedStages, setCompletedStages] = useState<TimelineStageId[]>([]);

  const reset = useCallback((): void => {
    setCompletedStages([]);
  }, []);

  useEffect(() => {
    if (!hasFile) {
      reset();
      return;
    }

    setCompletedStages((current) => {
      const next = new Set(current);
      next.add('upload');
      if (hasPreview) {
        next.add('parsed');
      }
      return Array.from(next);
    });
  }, [hasFile, hasPreview, reset]);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }

    setCompletedStages((current) => {
      const next = new Set(current);
      next.add('upload');
      next.add('parsed');
      next.add('analyzed');
      return Array.from(next);
    });

    const extractionTimer = window.setTimeout(() => {
      setCompletedStages((current) => {
        const next = new Set(current);
        next.add('extraction');
        return Array.from(next);
      });
    }, 1200);

    return () => window.clearTimeout(extractionTimer);
  }, [isProcessing]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    setCompletedStages(TIMELINE_STAGES.map((stage) => stage.id));
  }, [isComplete]);

  const isStageComplete = useCallback(
    (stageId: TimelineStageId): boolean => completedStages.includes(stageId),
    [completedStages],
  );

  const activeStage = TIMELINE_STAGES.find((stage) => !completedStages.includes(stage.id))?.id ?? 'ready';

  return { isStageComplete, activeStage, reset };
};
