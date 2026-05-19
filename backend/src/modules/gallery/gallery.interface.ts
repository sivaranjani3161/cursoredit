export interface ImageInput {
  id?: number;
  imageUrl: string;
  altText?: string | null;
}

export interface CreateGalleryBody {
  type: "internal" | "external";
  // external fields
  title?: string;
  slug?: string;
  createdBy?: number;
  location?: string | null;
  coverImage?: string | null;
  description?: string | null;
  eventDate?: string | null;
  galleryImages?: ImageInput[];
  // internal fields
  imageUrl?: string;
  altText?: string | null;
}

export interface UpdateGalleryBody {
  title?: string;
  slug?: string;
  location?: string | null;
  coverImage?: string | null;
  description?: string | null;
  eventDate?: string | null;
  galleryImages?: ImageInput[];
  // internal
  imageUrl?: string;
  altText?: string | null;
}

export interface GalleryIdParam {
  id: string;
}

export interface GalleryQuerystring {
  type?: "internal" | "external";
}
