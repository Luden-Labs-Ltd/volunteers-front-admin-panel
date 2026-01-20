/**
 * Типы для Program entity
 * Импортированы из contracts для типобезопасности
 */

export interface Program {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface CreateProgramRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateProgramRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
