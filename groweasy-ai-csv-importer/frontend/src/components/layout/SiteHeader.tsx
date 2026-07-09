'use client';

import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface SiteHeaderProps {
  onUploadClick: () => void;
  onLearnMoreClick: () => void;
}

export function SiteHeader({ onUploadClick, onLearnMoreClick }: SiteHeaderProps): JSX.Element {
  return (
    <header className="nav-bar">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          <button type="button" onClick={onUploadClick} className="btn-ghost">
            Upload
          </button>
          <button type="button" onClick={onLearnMoreClick} className="btn-ghost">
            How it works
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onUploadClick} className="btn-primary hidden px-4 py-2 sm:inline-flex">
            Get started
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
