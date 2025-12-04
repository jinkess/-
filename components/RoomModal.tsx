import React, { useState, useEffect } from 'react';
import { Room, RoomStatus, CheckInFormData, RoomType } from '../types';

interface RoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedRoom: Room) => void;
  existingRoomNumbers: string[];
}

type ModalView = 'MAIN' | 'CHECKOUT_CONFIRM' | 'EDIT';

const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose, onUpdate, existingRoomNumbers }) => {
  const [view, setView] = useState<ModalView>('MAIN');
  const [formData, setFormData] = useState<CheckInFormData>({
    guestName: '',
    phone: '',
    idCardNumber: '',
    days: 1
  });

  // Edit form state
  const [editData, setEditData] = useState({
    number: '',
    price: 0,
    type: RoomType.KING
  });
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (isOpen && room) {
      setFormData({ guestName: '', phone: '', idCardNumber: '', days: 1 });
      setEditData({
        number: room.number,
        price: room.price,
        type: room.type
      });
      setView('MAIN');
      setEditError('');
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...room,
      status: RoomStatus.OCCUPIED,
      guest: {
        name: formData.guestName,
        phone: formData.phone,
        idCardNumber: formData.idCardNumber,
        checkInTime: new Date().toISOString()
      }
    });
    onClose();
  };

  const calculateBill = () => {
    if (!room.guest) return { nights: 0, total: 0 };
    const checkIn = new Date(room.guest.checkInTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - checkIn.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    const nights = Math.max(1, Math.ceil(diffHours / 24));
    
    return {
      nights,
      total: nights * room.price
    };
  };

  const confirmCheckOut = () => {
    // const { guest, ...rest } = room; // Unused variable guest
    const { guest, ...rest } = room; 
    onUpdate({
      ...rest,
      status: RoomStatus.CLEANING
    });
    onClose();
  };

  const handleStatusChange = (status: RoomStatus) => {
    if (status !== RoomStatus.OCCUPIED && room.status === RoomStatus.OCCUPIED) {
       if (!confirm("修改状态将清除当前入住信息，是否继续？")) return;
       const { guest, ...rest } = room;
       onUpdate({ ...rest, status });
    } else {
       onUpdate({ ...room, status });
    }
    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const cleanNumber = editData.number.trim();
      
      if (!cleanNumber) {
          setEditError('房间号不能为空');
          return;
      }

      if (cleanNumber !== room.number && existingRoomNumbers.includes(cleanNumber)) {
          setEditError('房间号已存在');
          return;
      }

      onUpdate({
          ...room,
          number: cleanNumber,
          price: editData.price,
          type: editData.type
      });
      setView('MAIN');
  };

  const renderEditForm = () => (
      <form onSubmit={handleEditSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">编辑房间信息</h3>
        
        {editError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {editError}
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">房间号</label>
            <input 
                type="text" 
                value={editData.number}
                onChange={e => {
                    setEditData({...editData, number: e.target.value});
                    setEditError('');
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">房型</label>
            <select 
                value={editData.type}
                onChange={e => setEditData({...editData, type: e.target.value as RoomType})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
                {Object.values(RoomType).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">价格 (¥/晚)</label>
            <input 
                type="number" 
                min="0"
                value={editData.price}
                onChange={e => setEditData({...editData, price: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={() => setView('MAIN')}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md"
          >
            保存修改
          </button>
        </div>
      </form>
  );

  const renderCheckOutConfirm = () => {
    const bill = calculateBill();
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">退房结算</h3>
          <p className="text-sm text-gray-500">请核对账单信息</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">客人姓名</span>
            <span className="font-medium text-gray-900">{room.guest?.name}</span>
          </div>
          {room.guest?.idCardNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">证件号码</span>
              <span className="font-medium text-gray-900">{room.guest.idCardNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">入住时间</span>
            <span className="font-medium text-gray-900">{new Date(room.guest?.checkInTime || '').toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">退房时间</span>
            <span className="font-medium text-gray-900">{new Date().toLocaleString('zh-CN')}</span>
          </div>
          <div className="border-t border-dashed border-gray-200 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">住宿时长</span>
            <span className="font-medium text-gray-900">{bill.nights} 晚</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">单价</span>
            <span className="font-medium text-gray-900">¥{room.price}</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900">应收总额</span>
            <span className="text-xl font-bold text-blue-600">¥{bill.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('MAIN')}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            返回
          </button>
          <button
            onClick={confirmCheckOut}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md"
          >
            确认结账退房
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {room.number} 房间管理
            </h2>
            <p className="text-sm text-gray-500">{room.type} - ¥{room.price}/晚</p>
          </div>
          <div className="flex items-center gap-2">
            {view === 'MAIN' && (
                <button 
                    onClick={() => setView('EDIT')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="编辑房间信息"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {view === 'CHECKOUT_CONFIRM' ? renderCheckOutConfirm() : 
           view === 'EDIT' ? renderEditForm() : (
            <>
              {room.status === RoomStatus.VACANT ? (
                <form onSubmit={handleCheckIn} className="space-y-4">
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm mb-4 border border-emerald-100 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    当前房间空闲，可以办理入住。
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客人姓名</label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      value={formData.guestName}
                      onChange={e => setFormData({...formData, guestName: e.target.value})}
                      placeholder="请输入姓名"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="请输入手机号"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">证件号码</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      value={formData.idCardNumber}
                      onChange={e => setFormData({...formData, idCardNumber: e.target.value})}
                      placeholder="请输入身份证/证件号码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">预计天数</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      value={formData.days}
                      onChange={e => setFormData({...formData, days: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors mt-2">
                    办理入住
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {room.status === RoomStatus.OCCUPIED && (
                    <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">当前客人</span>
                        <span className="font-bold text-gray-800">{room.guest?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">联系电话</span>
                        <span className="font-medium text-gray-800 text-sm">{room.guest?.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">证件号码</span>
                        <span className="font-medium text-gray-800 text-sm">{room.guest?.idCardNumber || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">入住时间</span>
                        <span className="font-medium text-gray-800 text-sm">{new Date(room.guest?.checkInTime || '').toLocaleString('zh-CN')}</span>
                      </div>
                      <button 
                        onClick={() => setView('CHECKOUT_CONFIRM')}
                        className="w-full mt-2 py-2 border-2 border-red-100 text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors"
                      >
                        办理退房
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">更改房间状态</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleStatusChange(RoomStatus.VACANT)}
                        className="p-3 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50 text-gray-600"
                      >
                        空闲 (VACANT)
                      </button>
                      <button 
                        onClick={() => handleStatusChange(RoomStatus.CLEANING)}
                        disabled={room.status === RoomStatus.CLEANING}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          room.status === RoomStatus.CLEANING 
                          ? 'bg-amber-50 border-amber-200 text-amber-700 ring-2 ring-amber-500 ring-offset-1' 
                          : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        打扫 (CLEANING)
                      </button>
                      <button 
                        onClick={() => handleStatusChange(RoomStatus.MAINTENANCE)}
                        disabled={room.status === RoomStatus.MAINTENANCE}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          room.status === RoomStatus.MAINTENANCE 
                          ? 'bg-slate-50 border-slate-200 text-slate-700 ring-2 ring-slate-500 ring-offset-1' 
                          : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        维修 (MAINTENANCE)
                      </button>
                      <button 
                         className="p-3 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm cursor-not-allowed"
                         disabled
                      >
                        更多操作...
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomModal;