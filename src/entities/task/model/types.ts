/**
 * Типы для Task entity.
 * Алгоритм выровнен с backend Task entity и DTO.
 */

export type TaskStatus = 'active' | 'in_progress' | 'completed' | 'cancelled';

/** Контакт семьи (имя и телефон), если семья поделилась с волонтёром */
export interface NeedyContactShared {
  name: string;
  phone: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  programId: string;
  needyId: string;
  categoryId?: string;
  assignedVolunteerId?: string;
  assignedVolunteer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  /** Семья поделилась контактом с волонтёром */
  isNeedyContactShared?: boolean;
  needyContactSharedAt?: string | null;
  /** Контакт семьи (имя и телефон) — только если isNeedyContactShared */
  needyContact?: NeedyContactShared | null;
}

/**
 * CreateTaskRequest соответствует CreateTaskDto на бэкенде.
 */
export interface CreateTaskRequest {
  programId: string;
  needyId: string;
  type: string;
  title: string;
  description: string;
  details?: string;
  points?: number;
  categoryId?: string;
  skillIds?: string[];
  firstResponseMode?: boolean;
}

/**
 * UpdateTaskRequest соответствует PartialType(CreateTaskDto).
 */
export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

/**
 * AssignVolunteerRequest для назначения волонтера на задачу.
 */
export interface AssignVolunteerRequest {
  volunteerId: string;
}
