export interface IPropsStation {
  _id: string;
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openHours: string;
  status: "active" | "maintenance" | "inactive";
  createdAt: string;
  updatedAt: string;
}
