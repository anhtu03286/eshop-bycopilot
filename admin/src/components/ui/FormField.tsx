import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function InputField(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input {...rest} className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring" />
    </label>
  );
}

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
  const { label, children, ...rest } = props;
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select {...rest} className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring">
        {children}
      </select>
    </label>
  );
}

export function TextareaField(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        {...rest}
        className="min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
      />
    </label>
  );
}
