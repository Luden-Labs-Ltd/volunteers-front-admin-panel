export interface CityInGroup {
  id: string;
  name: string;
}

export interface CityGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  cities?: CityInGroup[];
}

export interface CreateCityGroupRequest {
  name: string;
  cityIds?: string[];
}

export interface UpdateCityGroupRequest {
  name: string;
}

export interface SetCityGroupCitiesRequest {
  cityIds: string[];
}
