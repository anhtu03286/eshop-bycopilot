export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">{text}</div>;
}

export function ErrorState({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <p>{text}</p>
      {onRetry ? (
        <button type="button" className="mt-3 rounded border border-rose-300 px-3 py-1 text-xs" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
