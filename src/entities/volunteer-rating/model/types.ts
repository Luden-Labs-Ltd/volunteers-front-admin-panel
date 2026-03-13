export interface VolunteerRating {
  id: string;
  score: number;
  comment?: string | null;
  createdAt: string;
}

export interface VolunteerRatingAdminItem {
  id: string;
  score: number;
  comment?: string | null;
  createdAt: string;
  volunteerUserId: string;
  volunteerFirstName?: string | null;
  volunteerLastName?: string | null;
  volunteerPhone?: string | null;
  volunteerEmail?: string | null;
  taskId: string;
}

export interface VolunteerRatingsAdminResponse {
  items: VolunteerRatingAdminItem[];
  total: number;
  page: number;
  limit: number;
}

export interface VolunteerRating {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
}
