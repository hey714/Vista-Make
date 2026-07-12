import { Plus, Repeat, ArrowLeftRight, Zap, Waves } from "lucide-react";

const actions = [
  { icon: Plus, label: "New sample" },
  { icon: Repeat, label: "Replace tip" },
  { icon: ArrowLeftRight, label: "Change experiment" },
  { icon: Zap, label: "Laser power profile" },
  { icon: Waves, label: "AFM frequency sweep" },
];

const statuses = ["Hardware", "AFM", "PiFM & PiF-IR"];

export function Toolbar() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-border-default bg-surface-0 px-3">
      <div className="flex items-center gap-4">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1 text-xs font-medium text-text-subtle hover:text-text-default"
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {statuses.map((label) => (
          <div key={label} className="flex items-center gap-1 text-xs font-medium text-text-subtle">
            <span className="size-1.5 rounded-full bg-green-500" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
