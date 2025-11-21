
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { AI_RESPONSES, DEFAULT_AI_RESPONSE, TRANSLATIONS } from '../constants';
import { Send, Minimize2, Sparkles, Bot, Wand2 } from 'lucide-react';

interface AICopilotProps {
  language: Language;
}

export const AICopilot: React.FC<AICopilotProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: language === 'zh' ? "您好！我是您的教学 AI 助手。今天需要我帮您查找资源或整理文件吗？" : "Hello! I'm your Teaching AI Co-pilot. How can I assist you with your resources today?",
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const processMessage = (text: string) => {
    // If the input matches a localized action string, map it back to the English key for the simulation to work
    let commandKey = text.trim();
    
    if (text === t.aiActions.rename) commandKey = "Rename and auto file";
    if (text === t.aiActions.audit) commandKey = "What needs updating?";
    if (text === t.aiActions.fileTests) commandKey = "Auto file new tests";

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(), // Display what the user actually clicked/typed
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      // Check for exact triggers defined in the constants (English keys)
      const responseText = AI_RESPONSES[commandKey] || DEFAULT_AI_RESPONSE;

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    processMessage(suggestion);
  };

  // Helper to render text with auto-detected links
  const renderMessageText = (text: string) => {
    // Simple regex to detect URLs starting with http:// or https://
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline underline-offset-2 hover:text-blue-100 break-all font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const suggestions = [
    t.aiActions.rename,
    t.aiActions.audit,
    t.aiActions.fileTests
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-50 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium opacity-0 group-hover:opacity-100">
          {language === 'zh' ? '打开 AI 助手' : 'Open AI Co-pilot'}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" style={{ height: '550px' }}>
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{t.aiTitle}</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-300">{t.aiOnline}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
              }`}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white">
        {/* Suggestion Chips */}
        {!isTyping && messages.length < 6 && (
          <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {suggestions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(action)}
                className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors border border-blue-100 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                {action}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="p-4 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.aiPlaceholder}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400">{t.aiSimMode}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
