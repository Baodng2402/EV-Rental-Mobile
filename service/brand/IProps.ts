export interface IPropsBrand {
  _id: string;
  code: string;
  name: string;
  description: string;
  baseDailyRate: number;
  depositAmount: number;
  imageUrl: string;
  images: string[];
  specs: {
    seats: number;
    range: number;
    horsePower: number;
    batteryCapacity: number;
    transmission: string;
    fuelType: string;
    carType: string;
    trunkCapacity: number;
    airbags: number;
    wheelSize: number;
    screenSize: number;
    dailyKmLimit: number;
  };
}
