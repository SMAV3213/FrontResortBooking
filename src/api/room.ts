import apiClient from './client';
import type { CreateRoomTypeDTO , UpdateRoomTypeDTO , RoomType , AvailableRoomFilter} from '../types/room';

export const roomApi = {
  // Get all room types
  getAll: () =>
    apiClient.get<RoomType[]>('/room-types'),

  // Get available rooms
  getAvailable: (filters: AvailableRoomFilter) =>
    apiClient.get<RoomType[]>('/room-types/available', {
      params: {
        guests: filters.guests,
        checkIn: filters.checkIn.toISOString(),
        checkOut: filters.checkOut.toISOString(),
      },
    }),

  // Get single room type
  getById: (id: string) =>
    apiClient.get<RoomType>(`/room-types/${id}`),

  // Create room type (Admin)
  create: (data: CreateRoomTypeDTO) => {
    const formData = new FormData();
    formData.append('Name', data.Name);
    formData.append('Description', data.Description);
    formData.append('Capacity', data.Capacity.toString());
    formData.append('PricePerNight', data.PricePerNight.toString());

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return apiClient.post<RoomType>('/room-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Update room type (Admin)
  update: (id: string, data: UpdateRoomTypeDTO) => {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('Name', data.Name);
    formData.append('Description', data.Description);
    formData.append('Capacity', data.Capacity.toString());
    formData.append('PricePerNight', data.PricePerNight.toString());

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return apiClient.put<RoomType>(`/room-types/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Delete room type (Admin)
  delete: (id: string) =>
    apiClient.delete(`/room-types/${id}`),
};
