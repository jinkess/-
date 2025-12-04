import React, { useState } from 'react';
import { RoomType, RoomStatus, Room } from '../types';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (room: Room) => void;
  existingRoomNumbers: string[];
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAdd, existingRoomNumbers }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: RoomType.KING,
    price: 1280,
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = formData.number.trim();
    
    if (!cleanNumber) {
        setError('请输入房间号');
        return;
    }
    
    if (existingRoomNumbers.includes(cleanNumber)) {
      setError('房间号已存在');
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      number: cleanNumber,
      type: formData.type,
      price: formData.price,
      status: RoomStatus.VACANT
    };

    onAdd(newRoom);
    onClose();
    // Reset form to defaults
    setFormData({ number: '', type: RoomType.KING, price: 1280 });
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">添加新房间</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>}
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">房间号</label>
                <input 
                    type="text" 
                    value={formData.number}
                    onChange={(e) => {
                        setFormData({...formData, number: e.target.value});
                        setError('');
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="例如: 808"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">房型</label>
                <div className="relative">
                  <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as RoomType})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                  >
                      {Object.values(RoomType).map(type => (
                          <option key={type} value={type}>{type}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格 (¥/晚)</label>
                <input 
                    type="number" 
                    min="0"
                    step="10"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    取消
                </button>
                <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm transition-colors"
                >
                    确认添加
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;