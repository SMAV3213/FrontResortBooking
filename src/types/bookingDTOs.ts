export interface BookingDTO {
    id: string
    roomId: string
    number: string
    userId: string
    login: string
    checkIn: string
    checkOut: string
    guestsCount: number
    totalPrice: number
    status: string
    createdAt: string
}

export interface CreateBookingDTO {
    userId: string;
    roomTypeId: string;
    checkIn: Date;
    checkOut: Date;
    guestsCount: number;
}

export interface UpdateBookingDTO {
    checkIn: Date;
    checkOut: Date;
    guestsCount: number;
}

export enum EBookingStatus {
    Created,
    Confirmed,
    Cancelled,
    Completed
}