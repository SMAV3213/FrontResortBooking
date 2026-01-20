export interface BookingDTO {
    id: string;
    roomId: string;
    userId: string;
    checkIn: Date;
    checkOut: Date;
    guestsCount: number;
    totalPrice: number;
    status: EBookingStatus;
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