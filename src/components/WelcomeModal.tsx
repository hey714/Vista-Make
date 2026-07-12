import { Button } from "./primitives";

export function WelcomeModal({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-md flex-col gap-4 border border-border-default bg-surface-0 p-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-primary-base">Prototype preview</span>
          <h2 className="text-xl font-medium text-text-default">Scan page prototype</h2>
        </div>
        <p className="text-sm font-medium text-text-subtle">
          This is a prototype of a scan page for a microscope hardware &amp; software demo, built entirely with
          Claude Code. It&apos;s hosted on GitHub — the repository link will be shared shortly.
        </p>
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" disabled>
            View on GitHub
          </Button>
          <Button variant="primary" className="flex-1" onClick={onDismiss}>
            Explore prototype
          </Button>
        </div>
      </div>
    </div>
  );
}
