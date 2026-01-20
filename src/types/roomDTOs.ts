export interface RoomDTO {
    id: string;
    number: string;
    status: ERoomStatus;
    roomType: RoomTypeInRoomsDTO
}

export interface CreateRoomDTO {
    number: string;
    roomTypeId: string;
}

export interface UpdateRoomDTO {
    number: string;
    status: ERoomStatus;
    roomTypeId: string;
}

export interface RoomTypeInRoomsDTO {
    id: string;
    name: string;
    description: string;
    capacity: number;
    pricePerNight: number;
}

export enum ERoomStatus {
    Available,
    Occupied,
    Maintenance,
}