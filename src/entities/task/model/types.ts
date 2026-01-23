/**
 * Типы для Task entity.
 * Алгоритм выровнен с backend Task entity и DTO.
 */

export type TaskStatus = 'active' | 'in_progress' | 'completed' | 'cancelled';

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
