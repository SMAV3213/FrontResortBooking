import type { RoomTypeWithoutRoomsDTO } from "../types/roomTypeDTOs"

export const mockRoomTypes: RoomTypeWithoutRoomsDTO[] = [
  {
    id: 'standard',
    name: 'Стандарт',
    description: 'Уютный номер для комфортного отдыха. Вид во двор.',
    capacity: 2,
    pricePerNight: 4200,
    imageUrls: ['https://storage.mrgeek.ru/AP1WsPyv3hk0NBxglw05mbiZnNI3uqTqkOhclE0Ddio/fit/505/505/no/1/aHR0cHM6Ly9tcmdlZWsucnUvaW1hZ2VzL3Byb2R1Y3RfcGljdHVyZXNfbmV3LzcwMDAvNzkwMC83OTI1L3Byb2R1Y3RfcGljdHVyZXMvb3JpZ2luYWwvNzkyNS0xLmpwZw.jpg'],
  },
  {
    id: 'comfort',
    name: 'Комфорт',
    description: 'Больше пространства, рабочая зона, улучшенная кровать.',
    capacity: 3,
    pricePerNight: 5900,
    imageUrls: ['https://storage.mrgeek.ru/AP1WsPyv3hk0NBxglw05mbiZnNI3uqTqkOhclE0Ddio/fit/505/505/no/1/aHR0cHM6Ly9tcmdlZWsucnUvaW1hZ2VzL3Byb2R1Y3RfcGljdHVyZXNfbmV3LzcwMDAvNzkwMC83OTI1L3Byb2R1Y3RfcGljdHVyZXMvb3JpZ2luYWwvNzkyNS0xLmpwZw.jpg'],
  },
  {
    id: 'suite',
    name: 'Люкс',
    description: 'Гостиная зона, панорамный вид, премиальные удобства.',
    capacity: 4,
    pricePerNight: 9900,
    imageUrls: ['https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffeygas.ru%2Fmaska-kakashka%2F&ved=0CBYQjRxqFwoTCMCy--nhnJIDFQAAAAAdAAAAABAI&opi=89978449'],
  },
]