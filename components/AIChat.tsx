import React, { useState, useRef, useEffect } from 'react';
import { generateHotelResponse } from '../services/aiService';
import { Room } from '../types';

interface AIChatProps {
  rooms: Room[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChat: React.FC<AIChatProps> = ({ rooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '你好！我是酒店智能助手。关于房间状态、入住情况或其他运营问题，随时问我！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await generateHotelResponse(userMsg, rooms);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，遇到了一点问题，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] mb-4 flex flex-col border overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-bold">HotelPro AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="询问..."
                className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-700' : 'bg-blue-600'} hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2`}
      >
        {!isOpen && <span className="text-xl">✨</span>}
        <span className="font-bold">{isOpen ? '关闭助手' : 'AI 助手'}</span>
      </button>
    </div>
  );
};

export default AIChat;