import React, { useState, useRef, useEffect } from 'react';
import { ASSISTANT_KNOWLEDGE } from '../data/menuData';
import { ChatMessage } from '../types';
import { X, Send, Bot, MessageCircle } from 'lucide-react';

interface AssistantChatProps {
  onOpenMenu?: () => void;
  onOpenApp?: () => void;
}

export const AssistantChat: React.FC<AssistantChatProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: '¡Hola! 👋 Soy Dorado, tu asistente en Arcos Dorados. Puedo ayudarte a armar un combo, resolver dudas sobre el menú, la ruleta de premios o promociones. ¿Qué se te antoja hoy?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickOptions = [
    'Ver el menú',
    '¿Cómo funciona la ruleta?',
    'Horarios',
    'Promociones',
    'McPoints',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const normalize = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ');
  };

  const findReply = (userText: string): string => {
    const text = normalize(userText);
    let bestMatch: (typeof ASSISTANT_KNOWLEDGE)[0] | null = null;
    let bestScore = 0;

    ASSISTANT_KNOWLEDGE.forEach(entry => {
      let score = 0;
      entry.keywords.forEach(k => {
        if (text.includes(normalize(k))) {
          score++;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    if (bestMatch) {
      return (bestMatch as (typeof ASSISTANT_KNOWLEDGE)[0]).reply;
    }

    return 'No estoy totalmente seguro de eso, pero con gusto puedo orientarte sobre nuestro menú, precios, la ruleta de premios, horarios de atención, ubicación de locales o promociones de la app. ¿Sobre cuál te gustaría saber más?';
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const delay = 400 + Math.random() * 400;
    setTimeout(() => {
      setIsTyping(false);
      const reply = findReply(query);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: reply,
      };
      setMessages(prev => [...prev, botMsg]);
    }, delay);
  };

  return (
    <>
      {/* Floating Toggle Bubble */}
      <button
        id="assistantToggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente Dorado"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[#DA291C] to-[#A8180D] shadow-[0_8px_24px_rgba(168,24,13,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-[#FFC72C]/40 group"
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          )}
          {/* Notification Dot */}
          {!isOpen && (
            <span className="assistant-dot absolute -top-2.5 -right-2.5 w-3.5 h-3.5 rounded-full bg-[#FFC72C] border-2 border-white" />
          )}
        </div>
      </button>

      {/* Floating Assistant Panel */}
      {isOpen && (
        <div
          id="assistantPanel"
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[75vh] bg-white rounded-3xl shadow-[0_20px_60px_rgba(43,27,14,0.3)] border border-[#2B1B0E]/10 flex flex-col overflow-hidden animate-pop select-none"
        >
          {/* Header */}
          <div className="bg-[#2B1B0E] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFC72C] flex items-center justify-center text-xl shadow-xs shrink-0">
                🍟
              </div>
              <div>
                <strong className="block text-sm font-black text-white leading-tight">
                  Dorado, tu asistente
                </strong>
                <p className="text-[11px] text-[#D9C7B3] leading-tight">
                  Pregúntame por el menú, promos o pedidos
                </p>
              </div>
            </div>
            <button
              id="assistantClose"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              aria-label="Cerrar asistente"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div
            id="assistantMessages"
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FFF8ED] custom-scrollbar text-xs leading-relaxed"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#DA291C] text-white self-end rounded-br-xs font-semibold shadow-xs'
                    : 'bg-white text-[#2B1B0E] self-start rounded-bl-xs shadow-xs border border-neutral-100 font-medium'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="bg-white text-[#5A3E24] self-start rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs border border-neutral-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E24]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E24]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E24]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Chips */}
          <div
            id="assistantQuick"
            className="bg-[#FFF8ED] px-3 pb-2 flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0"
          >
            {quickOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(opt)}
                className="bg-white border border-[#FFC72C] text-[#2B1B0E] hover:bg-[#FFC72C] font-bold text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            id="assistantForm"
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white border-t border-neutral-100 p-3 flex items-center gap-2 shrink-0"
          >
            <input
              id="assistantInput"
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe tu consulta..."
              autoComplete="off"
              className="flex-1 bg-[#FFF8ED]/60 border border-neutral-200 rounded-full px-4 py-2 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C] transition-colors"
            />
            <button
              type="submit"
              aria-label="Enviar mensaje"
              className="w-8 h-8 rounded-full bg-[#DA291C] hover:bg-[#A8180D] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
