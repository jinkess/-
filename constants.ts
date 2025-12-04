import { Room, RoomStatus, RoomType, FilterOption } from './types';

export const INITIAL_ROOMS: Room[] = [
  // 棋牌房
  { id: '2402', number: '2402', type: RoomType.CHESS, price: 1280, status: RoomStatus.VACANT },
  
  // 大床房
  { id: '2403', number: '2403', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2406', number: '2406', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2408', number: '2408', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2409', number: '2409', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2410', number: '2410', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2412', number: '2412', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2415', number: '2415', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },
  { id: '2418', number: '2418', type: RoomType.KING, price: 1280, status: RoomStatus.VACANT },

  // 双床房
  { id: '2411', number: '2411', type: RoomType.TWIN, price: 1280, status: RoomStatus.VACANT },
  { id: '2413', number: '2413', type: RoomType.TWIN, price: 1280, status: RoomStatus.VACANT },
  { id: '2416', number: '2416', type: RoomType.TWIN, price: 1280, status: RoomStatus.VACANT },
  { id: '2419', number: '2419', type: RoomType.TWIN, price: 1280, status: RoomStatus.VACANT },

  // 亲子房
  { id: '2401', number: '2401', type: RoomType.FAMILY, price: 1280, status: RoomStatus.VACANT },
  { id: '2405', number: '2405', type: RoomType.FAMILY, price: 1280, status: RoomStatus.VACANT },
];

export const FILTERS: FilterOption[] = [
  { label: '全部', value: 'ALL' },
  { label: '空闲', value: RoomStatus.VACANT },
  { label: '在住', value: RoomStatus.OCCUPIED },
  { label: '待洁', value: RoomStatus.CLEANING },
  { label: '维修', value: RoomStatus.MAINTENANCE },
];