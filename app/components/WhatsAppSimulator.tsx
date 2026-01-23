import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { ChatMessage } from '../types';

interface WhatsAppSimulatorProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white relative">
         {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #3A2C39 25%, transparent 25%, transparent 75%, #3A2C39 75%, #3A2C39), linear-gradient(45deg, #3A2C39 25%, transparent 25%, transparent 75%, #3A2C39 75%, #3A2C39)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium border-2 border-dark-purple shadow-cartoon-sm ${
                msg.sender === 'user' 
                  ? 'bg-misty-orchid text-white rounded-tr-none'
                  : 'bg-pale-purple text-dark-purple rounded-tl-none' 
              } ${msg.metadata?.isClickable ? 'cursor-pointer hover:shadow-cartoon transition-all' : ''}`}
              onClick={() => {
                if (msg.metadata?.isClickable && msg.text.includes('SEND_WHATSAPP:')) {
                  const sendCommand = msg.text.match(/SEND_WHATSAPP:(\d+)/)?.[0];
                  if (sendCommand) {
                    onSendMessage(sendCommand);
                  }
                }
              }}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.metadata?.isClickable && (
                <div className="mt-2 pt-2 border-t-2 border-dark-purple/20">
                  <button className="text-xs font-bold bg-dark-purple text-white px-3 py-1.5 rounded-lg hover:bg-misty-orchid transition-colors">
                    📤 Send via WhatsApp
                  </button>
                </div>
              )}
              <div className={`text-[10px] uppercase font-bold mt-1 text-right ${msg.sender === 'user' ? 'text-purple-100' : 'text-purple-800/60'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start relative z-10">
             <div className="bg-white border-2 border-dark-purple rounded-2xl rounded-tl-none p-3 shadow-cartoon-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-2 h-2 bg-dark-purple rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-dark-purple rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-dark-purple rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
           </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-white p-3 flex items-center gap-2 border-t-[3px] border-dark-purple">
        <button type="button" className="text-misty-orchid hover:text-dark-purple transition-colors">
            <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your instruction..."
            className="w-full bg-canvas-bg rounded-xl px-4 py-2 text-sm text-dark-purple font-medium border-2 border-transparent focus:border-dark-purple focus:outline-none transition-all placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-dark-purple text-white rounded-xl border-2 border-dark-purple hover:bg-misty-orchid transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};