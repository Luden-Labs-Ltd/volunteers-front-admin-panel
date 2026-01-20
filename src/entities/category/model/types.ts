/**
 * Типы для Category entity
 */

export interface Category {
  id: string;
  name: string;
  iconSvg: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface CreateCategoryRequest {
  name: string;
  iconSvg: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  iconSvg?: string;
}
