type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (next: number) => void;
};

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-slate-600">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
