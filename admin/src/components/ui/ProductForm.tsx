import { useEffect, useMemo, useState } from "react";
import { InputField, SelectField, TextareaField } from "@/components/ui/FormField";
import type { Category, Product } from "@/services/types";

type FormState = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  inventory: number;
  categoryId: string;
  imageUrls: string;
};

type Props = {
  categories: Category[];
  initial?: Partial<Product>;
  onSubmit: (payload: {
    name: string;
    slug: string;
    description?: string;
    priceCents: number;
    inventory: number;
    categoryId?: string;
    imageUrls?: string[];
  }) => Promise<void>;
  submitLabel: string;
};

export function ProductForm({ categories, initial, onSubmit, submitLabel }: Props) {
  const [state, setState] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    priceCents: 2500,
    inventory: 20,
    categoryId: "",
    imageUrls: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) {
      return;
    }

    setState((prev) => ({
      ...prev,
      name: initial.name ?? "",
      slug: initial.slug ?? "",
      description: initial.description ?? "",
      priceCents: initial.priceCents ?? 2500,
      inventory: initial.inventory ?? 20,
      categoryId: initial.categoryId ?? "",
      imageUrls: (initial.images ?? []).map((img) => img.url).join("\n"),
    }));
  }, [initial]);

  const previewUrls = useMemo(() => state.imageUrls.split("\n").map((url) => url.trim()).filter(Boolean), [state.imageUrls]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: state.name,
        slug: state.slug,
        description: state.description || undefined,
        priceCents: Number(state.priceCents),
        inventory: Number(state.inventory),
        categoryId: state.categoryId || undefined,
        imageUrls: previewUrls.length > 0 ? previewUrls : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Name"
          value={state.name}
          onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <InputField
          label="Slug"
          value={state.slug}
          onChange={(e) => setState((prev) => ({ ...prev, slug: e.target.value }))}
          required
        />
      </div>
      <TextareaField
        label="Description"
        value={state.description}
        onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <InputField
          label="Price (cents)"
          type="number"
          min={1}
          value={state.priceCents}
          onChange={(e) => setState((prev) => ({ ...prev, priceCents: Number(e.target.value) }))}
          required
        />
        <InputField
          label="Inventory"
          type="number"
          min={0}
          value={state.inventory}
          onChange={(e) => setState((prev) => ({ ...prev, inventory: Number(e.target.value) }))}
          required
        />
        <SelectField
          label="Category"
          value={state.categoryId}
          onChange={(e) => setState((prev) => ({ ...prev, categoryId: e.target.value }))}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="space-y-2">
        <TextareaField
          label="Image URLs (one URL per line or data URL)"
          value={state.imageUrls}
          onChange={(e) => setState((prev) => ({ ...prev, imageUrls: e.target.value }))}
        />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm">
          <span>Upload image file</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const value = String(reader.result ?? "");
                setState((prev) => ({
                  ...prev,
                  imageUrls: prev.imageUrls ? `${prev.imageUrls}\n${value}` : value,
                }));
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>

      {previewUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {previewUrls.slice(0, 4).map((url) => (
            <img key={url} src={url} alt="Preview" className="h-24 w-full rounded object-cover" />
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
