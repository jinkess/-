import React, { useState, useMemo } from 'react';
import { Room, RoomStatus, RoomType } from './types';
import { INITIAL_ROOMS } from './constants';
import Sidebar from './components/Sidebar';
import RoomCard from './components/RoomCard';
import RoomModal from './components/RoomModal';
import AddRoomModal from './components/AddRoomModal';

function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const statusMatch = statusFilter === 'ALL' || room.status === statusFilter;
      const typeMatch = typeFilter === 'ALL' || room.type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [rooms, statusFilter, typeFilter]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(prevRooms => 
      prevRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)
    );
    // Fix: Immediately update the selected room in the modal to reflect edits (number/type/price)
    if (selectedRoom?.id === updatedRoom.id) {
      setSelectedRoom(updatedRoom);
    }
  };

  const handleAddRoom = (newRoom: Room) => {
    setRooms(prevRooms => [...prevRooms, newRoom]);
  };

  const getHeaderText = () => {
    const statusText = statusFilter === 'ALL' ? '' : 
             statusFilter === RoomStatus.VACANT ? '空闲' :
             statusFilter === RoomStatus.OCCUPIED ? '在住' :
             statusFilter === RoomStatus.CLEANING ? '待打扫' : '维修中';
    
    const typeText = typeFilter === 'ALL' ? '' : typeFilter;
    
    if (!statusText && !typeText) return '全部房间';
    if (statusText && typeText) return `${statusText} · ${typeText}`;
    if (statusText) return `${statusText}房间`;
    return typeText;
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden">
      <Sidebar 
        rooms={rooms} 
        currentStatusFilter={statusFilter} 
        onStatusFilterChange={setStatusFilter}
        currentTypeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        onAddRoomClick={() => setIsAddRoomModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {getHeaderText()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">共找到 {filteredRooms.length} 个房间</p>
          </div>
          {/* Removed Duty Staff Section */}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={handleRoomClick} 
              />
            ))}
          </div>
          
          {filteredRooms.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p>没有找到相关房间</p>
            </div>
          )}
        </div>
      </main>

      <RoomModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateRoom}
        existingRoomNumbers={rooms.map(r => r.number)}
      />

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAdd={handleAddRoom}
        existingRoomNumbers={rooms.map(r => r.number)}
      />
    </div>
  );
}

export default App;