export interface RoomTypeDTO {
    id: string;
    name: string;
    description: string;
    pricePerNight: number;
    imageUrls: string[];
    rooms:RoomsInRoomTypeDTO[];
}

export interface RoomTypeWithoutRoomsDTO {
    id: string;
    name: string;
    description: string;
    capacity: number;
    pricePerNight: number;
    imageUrls: string[];
}

export interface CreateRoomTypeDTO {
    name: string;
    description: string;
    capacity: number;
    pricePerNight: number;
}

export interface UpdateRoomTypeDTO {
    name: string;
    description: string;
    capacity: number;
    pricePerNight: number;
}

export interface RoomsInRoomTypeDTO {
    id: string;
    name: string;
    description: string;
    capacity: number;
}


