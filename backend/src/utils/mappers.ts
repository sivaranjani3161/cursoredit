
export interface NestedItem {
  title: string;
  description: string[];
  icon: string | null;
  phaseNumber?: number;
  sortOrder: number;
}

export function mapNestedItems(arr: unknown[]): NestedItem[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item: unknown) => {
      const i = item as Record<string, unknown>;
      return {
        title: String(i?.title ?? "").trim(),
        description: Array.isArray(i?.description)
          ? (i.description as unknown[])
              .map((p) => String(p ?? "").trim())
              .filter(Boolean)
          : [],
        icon: i?.icon ? String(i.icon) : null,
        phaseNumber:
          i?.phaseNumber !== undefined && i?.phaseNumber !== null
            ? Number(i.phaseNumber)
            : undefined,
        sortOrder:
          i?.sortOrder !== undefined && i?.sortOrder !== null
            ? Number(i.sortOrder)
            : 0,
      };
    })
    .filter((item) => item.title.length > 0);
}

/**
 * Maps image entries (from gallery form payload).
 */
export interface ImageItem {
  id?: number;
  imageUrl: string;
  altText: string | null;
}

export function mapImageItems(arr: unknown[]): ImageItem[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item: unknown) => {
      const i = item as Record<string, unknown>;
      return {
        id: i?.id ? Number(i.id) : undefined,
        imageUrl: String(i?.imageUrl ?? "").trim(),
        altText: i?.altText ? String(i.altText) : null,
      };
    })
    .filter((item) => item.imageUrl.length > 0);
}
