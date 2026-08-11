import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, Zap, User } from 'lucide-react';
import { AI_PROMPTS, AI_KNOWLEDGE_BASE } from '../../data/mockData';

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am the ClubVerse AI Football Assistant. Ask me about squad tactics, player performance stats, upcoming fixtures, or matchday ticket options!',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Dynamic intelligent AI response generator
    setTimeout(() => {
      let replyText = AI_KNOWLEDGE_BASE.default;
      const lower = query.toLowerCase();

      if (lower.includes('tactic') || lower.includes('formation') || lower.includes('barcelona')) {
        replyText = AI_KNOWLEDGE_BASE.tactics;
      } else if (lower.includes('sterling') || lower.includes('goals') || lower.includes('stats')) {
        replyText = AI_KNOWLEDGE_BASE.sterling;
      } else if (lower.includes('ticket') || lower.includes('buy') || lower.includes('vip')) {
        replyText = AI_KNOWLEDGE_BASE.tickets;
      } else if (lower.includes('result') || lower.includes('recent') || lower.includes('chelsea')) {
        replyText = AI_KNOWLEDGE_BASE.results;
      } else if (lower.includes('manager') || lower.includes('alex vance') || lower.includes('coach')) {
        replyText = AI_KNOWLEDGE_BASE.manager;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs animate-fade-in p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight">ClubVerse AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">Real-time Football Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {AI_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded-lg border border-slate-200 shrink-0 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
              }`}>
                <p>{msg.text}</p>
                <span className={`block text-[9px] mt-1 font-medium text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-white p-3 rounded-2xl max-w-[140px] border border-slate-200 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing stats...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Assistant anything about ClubVerse..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-100 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
