export enum RoomStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum RoomType {
  CHESS = '棋牌房',
  KING = '大床房',
  TWIN = '双床房',
  FAMILY = '亲子房'
}

export interface Guest {
  name: string;
  phone?: string;
  idCardNumber?: string;
  checkInTime: string; // ISO String
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
  guest?: Guest;
}

export interface FilterOption {
  label: string;
  value: RoomStatus | 'ALL';
}

export interface CheckInFormData {
  guestName: string;
  phone: string;
  idCardNumber: string;
  days: number;
}