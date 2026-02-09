export { cityGroupApi } from './api/city-group-api';
export {
  useGetCityGroups,
  useGetCityGroup,
  useCreateCityGroup,
  useUpdateCityGroup,
  useDeleteCityGroup,
  useSetGroupCities,
} from './model/hooks';
export type {
  CityGroup,
  CityInGroup,
  CreateCityGroupRequest,
  UpdateCityGroupRequest,
  SetCityGroupCitiesRequest,
} from './model/types';
