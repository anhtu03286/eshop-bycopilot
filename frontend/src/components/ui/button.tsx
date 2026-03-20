import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-sky-600 text-white hover:bg-sky-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`.trim()}
    />
  );
}
