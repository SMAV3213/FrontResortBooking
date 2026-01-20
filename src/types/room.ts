// Room Types DTOs
export interface CreateRoomTypeDTO {
  Name: string;
  Description: string;
  Capacity: number;
  PricePerNight: number;
  images?: File[];
}

export interface UpdateRoomTypeDTO {
  Id: string;
  Name: string;
  Description: string;
  Capacity: number;
  PricePerNight: number;
  images?: File[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
}

export interface AvailableRoomFilter {
  guests: number;
  checkIn: Date;
  checkOut: Date;
}

export interface Booking {
  id: string;
  roomTypeId: string;
  roomType: RoomType;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed'
}
