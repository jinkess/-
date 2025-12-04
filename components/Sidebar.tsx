import React from 'react';
import { Room, RoomStatus, FilterOption, RoomType } from '../types';
import { FILTERS } from '../constants';

interface SidebarProps {
  rooms: Room[];
  currentStatusFilter: string;
  onStatusFilterChange: (val: string) => void;
  currentTypeFilter: string;
  onTypeFilterChange: (val: string) => void;
  onAddRoomClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  rooms, 
  currentStatusFilter, 
  onStatusFilterChange, 
  currentTypeFilter,
  onTypeFilterChange,
  onAddRoomClick 
}) => {
  const stats = {
    total: rooms.length,
    vacant: rooms.filter(r => r.status === RoomStatus.VACANT).length,
    occupied: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length,
    cleaning: rooms.filter(r => r.status === RoomStatus.CLEANING).length,
    maintenance: rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length,
  };

  // Calculate stats dynamically for all RoomTypes
  const typeStats = Object.values(RoomType).reduce((acc, type) => {
    acc[type] = rooms.filter(r => r.type === type).length;
    return acc;
  }, {} as Record<RoomType, number>);

  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🏢</span> 林栖 · 智选酒店
        </h1>
        <p className="text-xs text-gray-400 mt-1">林栖 · 智选酒店管理系统</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">运营概览</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-xl">
              <span className="text-sm text-blue-600 font-medium">入住率</span>
              <div className="text-3xl font-bold text-blue-900 mt-1">{occupancyRate}%</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500">在住</span>
                <span className="block text-xl font-bold text-rose-600">{stats.occupied}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500">空闲</span>
                <span className="block text-xl font-bold text-emerald-600">{stats.vacant}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">状态筛选</h3>
          <div className="space-y-1">
            {FILTERS.map((filter: FilterOption) => (
              <button
                key={filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                  currentStatusFilter === filter.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{filter.label}</span>
                {filter.value !== 'ALL' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    currentStatusFilter === filter.value ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filter.value === RoomStatus.VACANT && stats.vacant}
                    {filter.value === RoomStatus.OCCUPIED && stats.occupied}
                    {filter.value === RoomStatus.CLEANING && stats.cleaning}
                    {filter.value === RoomStatus.MAINTENANCE && stats.maintenance}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">房型筛选</h3>
          <div className="space-y-1">
            <button
              onClick={() => onTypeFilterChange('ALL')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                currentTypeFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>全部房型</span>
            </button>
            {Object.values(RoomType).map((type) => (
              <button
                key={type}
                onClick={() => onTypeFilterChange(type)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                  currentTypeFilter === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  currentTypeFilter === type ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {typeStats[type] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onAddRoomClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          添加房间
        </button>
        <div className="text-xs text-center text-gray-400">
          © 2024 林栖 · 智选酒店 v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;