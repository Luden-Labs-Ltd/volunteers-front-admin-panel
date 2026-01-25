/**
 * Типы для Category entity
 */

export interface Category {
  id: string;
  name: string;
  iconSvg?: string; // Deprecated, use imageId
  imageId?: string;
  image?: {
    id: string;
    url: string;
    filename: string;
  };
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface CreateCategoryRequest {
  name: string;
  iconSvg?: string; // Deprecated, use imageId
  imageId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  iconSvg?: string; // Deprecated, use imageId
  imageId?: string;
}
