import { Logo } from '@/components/ui/Logo';

export function DashboardFooter(): JSX.Element {
  return (
    <footer className="relative border-t border-subtle bg-surface/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              AI-powered CRM lead extraction for modern sales teams.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <span className="badge">Secure browser parsing</span>
            <span className="badge">AI field mapping</span>
            <span className="badge">CSV & JSON export</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-subtle">© {new Date().getFullYear()} LeadSense. All rights reserved.</p>
          <p className="text-xs text-subtle">Built for teams who value clean data.</p>
        </div>
      </div>
    </footer>
  );
}
