import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function TextField({
  className = "",
  suffixIcon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { suffixIcon?: ReactNode }) {
  return (
    <div
      className={`flex h-7 items-center gap-0.5 border-b border-border-default bg-surface-page-default px-1 ${className}`}
    >
      <input
        {...props}
        className="min-w-0 flex-1 bg-transparent px-0.5 text-xs font-medium text-text-default outline-none"
      />
      {suffixIcon}
    </div>
  );
}

export function SelectField({
  value,
  className = "",
  icon,
  warn = false,
}: {
  value: string;
  className?: string;
  icon?: ReactNode;
  warn?: boolean;
}) {
  return (
    <div
      className={`flex h-7 items-center gap-0.5 border border-border-default bg-surface-0 px-2 py-1 ${className}`}
    >
      {icon}
      <span className={`flex-1 px-0.5 text-xs font-medium ${warn ? "text-warning-light" : "text-text-subtle"}`}>
        {value}
      </span>
      <ChevronDown size={16} className="shrink-0 text-text-subtle" />
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "surface" | "danger";

export function Button({
  className = "",
  variant = "secondary",
  active = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; active?: boolean }) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary-base text-white",
    secondary: "bg-surface-0 border border-button-secondary-outline text-text-subtle",
    ghost: active
      ? "bg-surface-0 border border-button-secondary-outline text-text-default"
      : "text-text-light",
    surface: active
      ? "bg-surface-0 border border-border-default text-text-subtle"
      : "text-text-subtle",
    danger: "bg-red-600 text-white",
  };
  return (
    <button
      {...props}
      className={`flex h-7 items-center justify-center gap-0.5 px-2 py-1 text-xs font-semibold whitespace-nowrap disabled:border-border-subtle disabled:bg-surface-0 disabled:text-text-disabled ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconButton({
  className = "",
  active = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={`flex size-5 shrink-0 items-center justify-center border bg-surface-0 text-text-subtle ${
        active ? "border-primary-base text-primary-base" : "border-border-default"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  size = "sm",
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  size?: "xs" | "sm";
}) {
  const w = size === "xs" ? "w-[22px]" : "w-[30px]";
  const h = size === "xs" ? "h-3" : "h-4";
  const knob = size === "xs" ? "size-2.5" : "size-3.5";
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`relative shrink-0 rounded-full transition-colors ${w} ${h} ${
        checked ? "bg-primary-base" : "bg-gray-400"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-all ${knob} ${
          checked ? "right-px" : "left-px"
        }`}
      />
    </button>
  );
}

export function ToggleItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Toggle checked={checked} onChange={onChange} size="xs" />
      <span className="text-xs font-medium whitespace-nowrap text-text-subtle">{label}</span>
    </div>
  );
}

export function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
}) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-1">
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-primary-base" : "border-gray-400"
        }`}
      >
        {checked && <span className="size-2 rounded-full bg-primary-base" />}
      </span>
      <span className="text-xs font-medium whitespace-nowrap text-text-default">{label}</span>
    </button>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
}) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-1">
      <span
        className={`flex size-4 shrink-0 items-center justify-center border ${
          checked ? "border-primary-base bg-primary-base" : "border-gray-400"
        }`}
      >
        {checked && <span className="size-2 bg-white" />}
      </span>
      <span className="text-xs font-medium whitespace-nowrap text-text-subtle">{label}</span>
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex h-3 w-full items-center justify-center gap-2">
      <div className="h-px flex-1 bg-border-default" />
      <span className="text-xs font-medium whitespace-nowrap text-text-light">{label}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

export function CardHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex h-8 items-center justify-between gap-2 border-b border-border-default bg-surface-1 p-2">
      <span className="flex-1 px-0.5 text-xs font-semibold text-text-subtle">{title}</span>
      {right}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col bg-surface-0 ${className}`}>
      {children}
    </div>
  );
}
