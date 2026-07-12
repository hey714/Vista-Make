export function TooSmallPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-surface-0 px-8 text-center">
      <span className="text-xs font-semibold text-primary-base">Scan Page Prototype</span>
      <h1 className="text-xl font-medium text-text-default">This prototype is best enjoyed in a larger window</h1>
      <p className="max-w-md text-sm font-medium text-text-subtle">
        Your current window is too narrow to render the scan layout properly. Please widen your browser window
        or switch to a larger screen, then this page will load automatically.
      </p>
    </div>
  );
}
