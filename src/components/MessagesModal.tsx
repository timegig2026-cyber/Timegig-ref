import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCheck, Star } from 'lucide-react';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatThread {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Array<{ sender: 'user' | 'other'; text: string; time: string }>;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 't-1',
    name: 'Elena Rostova',
    role: 'Artisan Roast & Brew',
    lastMessage: 'Are you available to arrive 15 minutes before 2 PM?',
    time: '4m ago',
    unread: true,
    messages: [
      { sender: 'other', text: 'Hi! Saw your profile on the map. Are you still nearby?', time: '2:15 PM' },
      { sender: 'user', text: 'Yes, I am just 400m away on Market St.', time: '2:16 PM' },
      { sender: 'other', text: 'Are you available to arrive 15 minutes before 2 PM?', time: '2:18 PM' },
    ],
  },
  {
    id: 't-2',
    name: 'David K.',
    role: 'Downtown Legal Express',
    lastMessage: 'Package picked up. Tracking live delivery.',
    time: '32m ago',
    unread: false,
    messages: [
      { sender: 'other', text: 'Thanks for accepting the express run!', time: '1:40 PM' },
      { sender: 'user', text: 'Package picked up. Tracking live delivery.', time: '1:45 PM' },
    ],
  },
];

export const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose }) => {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('t-1');
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            lastMessage: replyText.trim(),
            time: 'Just now',
            unread: false,
            messages: [
              ...thread.messages,
              { sender: 'user', text: replyText.trim(), time: 'Just now' },
            ],
          };
        }
        return thread;
      })
    );
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="messages-inbox-title"
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h2 id="messages-inbox-title" className="text-base font-bold text-white">
              GiGs Messages &amp; Inquiries
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Thread list */}
          <div className="w-1/3 border-r border-slate-800/80 bg-slate-950/30 overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full p-3 text-left transition-colors border-b border-slate-800/40 ${
                  activeThreadId === t.id ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{t.name}</span>
                  {t.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{t.lastMessage}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{t.time}</span>
              </button>
            ))}
          </div>

          {/* Active Conversation */}
          <div className="flex-1 flex flex-col bg-slate-900/50">
            {/* Conversation Header */}
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/20">
              <div>
                <div className="text-xs font-bold text-white">{currentThread.name}</div>
                <div className="text-[11px] text-slate-400">{currentThread.role}</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Active Client
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {currentThread.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                placeholder="Type your response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
