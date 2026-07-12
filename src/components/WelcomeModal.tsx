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
          Claude Code from a high-fidelity Figma design.
        </p>
        <div className="flex gap-2 pt-2">
          <a
            href="https://github.com/hey714/Vista-Make"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 flex-1 items-center justify-center gap-0.5 border border-button-secondary-outline bg-surface-0 px-2 py-1 text-xs font-semibold whitespace-nowrap text-text-subtle"
          >
            View on GitHub
          </a>
          <Button variant="primary" className="flex-1" onClick={onDismiss}>
            Explore prototype
          </Button>
        </div>
      </div>
    </div>
  );
}
