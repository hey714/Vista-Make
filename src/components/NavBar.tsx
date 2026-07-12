import { Minus, Square, X } from "lucide-react";

const menuItems = ["File", "Configure", "Tools", "Diagnostics", "Help"];

export function NavBar() {
  return (
    <div className="flex h-7 items-center justify-between border-b border-border-default bg-surface-1">
      <div className="flex h-full items-center">
        <div className="flex items-center gap-1 px-1.5">
          <div className="flex size-4 items-center justify-center rounded-sm bg-primary-base text-[9px] font-bold text-white">
            M
          </div>
        </div>
        <div className="flex h-full items-center">
          {menuItems.map((item) => (
            <button
              key={item}
              className="flex h-full items-center gap-0.5 px-2 py-0.5 text-xs font-semibold text-text-subtle hover:bg-surface-card-quiet"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 px-1.5 text-text-subtle">
        <Minus size={14} />
        <Square size={12} />
        <X size={14} />
      </div>
    </div>
  );
}
