/**
 * Типы для Skill entity
 */

import type { Category } from '@/entities/category';

export interface Skill {
  id: string;
  name: string;
  iconSvg: string;
  categoryId: string;
  category?: Category; // included when relations loaded
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface CreateSkillRequest {
  name: string;
  iconSvg: string;
  categoryId: string;
}

export interface UpdateSkillRequest {
  name?: string;
  iconSvg?: string;
  categoryId?: string;
}

export interface QuerySkillsParams {
  categoryId?: string; // optional filter by category
}
