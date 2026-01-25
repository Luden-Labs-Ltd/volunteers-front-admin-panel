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
  cityId?: string;
  address?: string;
}

// См. backend/src/user/dto/update-user.dto.ts (PartialType(CreateUserDto) + status)
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: UserStatus;
}

// См. backend/src/user/types/user.ts
// Базовый тип пользователя без пароля
type BaseUser = Omit<User, 'passwordHash' | 'refreshTokenHash'>;

// Типы для расширенных пользователей с данными роли
// См. backend/src/user/entities/volunteer.entity.ts
export interface VolunteerProfile {
  id: string;
  userId: string;
  cityId?: string;
  points: number;
  completedTasksCount: number;
  rating?: number | null;
  city?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  programs?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
  skills?: Array<{
    id: string;
    name: string;
    iconSvg: string;
    categoryId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// См. backend/src/user/entities/needy.entity.ts
export interface NeedyProfile {
  id: string;
  userId: string;
  programId: string;
  cityId?: string;
  address?: string;
  creatorId: string;
  program?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
  city?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role: UserRole;
  };
  createdAt: string;
  updatedAt: string;
}

// См. backend/src/user/entities/admin.entity.ts
export interface AdminProfile {
  id: string;
  userId: string;
  ownedPrograms?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
  createdByAdmin?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role: UserRole;
  };
  createdAt: string;
  updatedAt: string;
}

// Типы для расширенных пользователей с данными роли
export interface UserWithVolunteerData extends BaseUser {
  role: 'volunteer';
  profile: VolunteerProfile;
}

export interface UserWithNeedyData extends BaseUser {
  role: 'needy';
  profile: NeedyProfile;
}

export interface UserWithAdminData extends BaseUser {
  role: 'admin';
  profile: AdminProfile;
}

// Объединенный тип для всех расширенных пользователей
export type UserWithRoleData =
  | UserWithVolunteerData
  | UserWithNeedyData
  | UserWithAdminData;
