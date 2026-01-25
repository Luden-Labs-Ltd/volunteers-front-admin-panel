export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}
