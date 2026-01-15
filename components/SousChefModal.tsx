
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ChefHat, Bot } from 'lucide-react';
import { Recipe, ChatMessage } from '../types';
import { getRecipeChatSession } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Props {
  recipe: Recipe;
  onClose: () => void;
  currentStepContext?: string;
}

// Simple Markdown Parser for "Premium" rendering
const FormattedText: React.FC<{ text: string; role: 'user' | 'model' }> = ({ text, role }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className={`text-sm leading-relaxed ${role === 'user' ? 'text-white' : 'text-obsidian/80'}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

export const SousChefModal: React.FC<Props> = ({ recipe, onClose, currentStepContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSessionRef.current = getRecipeChatSession(recipe);
      // Initial greeting
      setMessages([{
        role: 'model',
        text: `Bonjour! I am your Sous Chef. I've analyzed the protocol for "${recipe.title}". How can I assist you with the preparation?`,
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error("Failed to initialize chat session:", e);
      setMessages([{
        role: 'model',
        text: "System Alert: Neural Uplink failed. Please verify your API Key in Settings.",
        timestamp: Date.now()
      }]);
    }
  }, [recipe]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Inject context if provided (e.g., current step)
      let prompt = input;
      if (currentStepContext) {
        prompt = `[User is currently at step: "${currentStepContext}"]. Question: ${input}`;
      }

      const result = await chatSessionRef.current.sendMessageStream({ message: prompt });
      
      const modelMsgId = Date.now();
      let fullResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelMsgId }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(m => 
            m.timestamp === modelMsgId ? { ...m, text: fullResponse } : m
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the neural network. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-obsidian/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[600px] border border-white/40"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-obsidian text-gold flex items-center justify-center shadow-lg">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-obsidian text-lg">Neural Sous Chef</h3>
              <p className="text-[10px] uppercase tracking-widest text-obsidian/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold" />
                Gemini 3 Flash Context
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-obsidian/60" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scrollbar-thin">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-obsidian text-white rounded-br-none'
                    : 'bg-white text-obsidian border border-gray-100 rounded-bl-none'
                }`}
              >
                <FormattedText text={msg.text} role={msg.role} />
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-obsidian/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-obsidian/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-obsidian/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-black/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about substitutions, techniques..."
              className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-gold/30 hover:bg-white rounded-xl pl-4 pr-12 py-3.5 text-sm transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-obsidian text-white rounded-lg shadow-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
