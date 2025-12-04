import React from 'react';
import { Room, RoomStatus } from '../types';

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const getStatusStyles = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.VACANT:
        return 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100';
      case RoomStatus.OCCUPIED:
        return 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100';
      case RoomStatus.CLEANING:
        return 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100';
      case RoomStatus.MAINTENANCE:
        return 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.VACANT: return '空闲';
      case RoomStatus.OCCUPIED: return '在住';
      case RoomStatus.CLEANING: return '打扫中';
      case RoomStatus.MAINTENANCE: return '维修中';
      default: return status;
    }
  };

  return (
    <div 
      onClick={() => onClick(room)}
      className={`relative p-4 border rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${getStatusStyles(room.status)}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl font-bold">{room.number}</span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50 border border-black/5">
          {getStatusLabel(room.status)}
        </span>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm opacity-90">{room.type}</p>
        <p className="text-sm font-medium">¥{room.price}/晚</p>
      </div>

      {room.guest && (
        <div className="mt-3 pt-3 border-t border-black/10">
          <p className="text-xs font-bold truncate">👤 {room.guest.name}</p>
          <p className="text-[10px] opacity-75 truncate">🕒 {new Date(room.guest.checkInTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}</p>
        </div>
      )}
    </div>
  );
};

export default RoomCard;