// Должно быть строго синхронизировано с backend User entity и DTO

// См. backend/src/shared/user/type.ts
export type UserRole = 'volunteer' | 'needy' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'blocked';

// См. backend/src/user/entities/user.entity.ts и user.service.ts (select в findAll)
export interface User {
  id: string;
  phone?: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  photo?: string;
  about?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// См. backend/src/user/dto/create-user.dto.ts
export interface CreateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  status?: UserStatus;
  programId?: string;
  photo?: string;
  about?: string;
  skills?: string[];
}

// См. backend/src/user/dto/update-user.dto.ts (PartialType(CreateUserDto) + status)
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: UserStatus;
}

