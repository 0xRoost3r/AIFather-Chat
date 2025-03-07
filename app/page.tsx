"use client"

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageSquare, Brain } from 'lucide-react';
import './index.css';
import useWindowSize from './hooks/useWindowSize';

interface Message {
  text: string;
  isBot: boolean;
}

// Background bubble component
const BackgroundBubble = ({ index }: { index: number }) => {
  const style = useMemo(() => ({
    background: index % 2 === 0 ? '#ff49db' : '#0055ff',
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
  }), [index]);

  const { width, height } = useWindowSize();


  const animation = useMemo(() => ({
    x: [Math.random() * width, Math.random() * width],
    y: [Math.random() * height, Math.random() * height],
    scale: [1, 1.2, 1],
  }), []);

  return (
    <motion.div
      className="absolute rounded-full opacity-20"
      style={style}
      animate={animation}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  // Memoize background bubbles
  const backgroundBubbles = useMemo(() => 
    [...Array(20)].map((_, i) => <BackgroundBubble key={i} index={i} />),
    []
  );


  const handleSend = () => {
    if (input.trim()) {
      setShowIntro(false);
      setMessages([...messages, { text: input, isBot: false }]);
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for your message! I'm a demo chatbot.", isBot: true }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="h-screen bg-[#0a192f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Optimized background elements */}
      {backgroundBubbles}

      <div className="container mx-auto h-full max-w-6xl flex gap-4">
        {/* Introduction Panel with improved animations */}
        <AnimatePresence mode="popLayout">
          {showIntro && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: -100,
                transition: { 
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:flex w-1/3 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-pink-500 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Gen8 Agent</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="text-pink-500" size={20} />
                    <h3 className="font-semibold">AI-Powered Assistance</h3>
                  </div>
                  <p className="text-white/70">Advanced natural language processing for human-like conversations.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <MessageSquare className="text-blue-500" size={20} />
                    <h3 className="font-semibold">24/7 Availability</h3>
                  </div>
                  <p className="text-white/70">Ready to help you anytime with instant responses.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Brain className="text-pink-500" size={20} />
                    <h3 className="font-semibold">Smart Learning</h3>
                  </div>
                  <p className="text-white/70">Continuously improving to better serve your needs.</p>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-white/50 text-sm">Start typing in the chat to begin your conversation.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container with smooth layout transitions */}
        <motion.div
          layout
          transition={{
            layout: { duration: 0.3, ease: "easeInOut" }
          }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-pink-500/20 flex flex-col w-full md:w-2/3 md:flex-1"
        >
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-4">
            <h1 className="text-white text-xl font-bold">Chat with Gen8</h1>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.isBot ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-blue-500' : 'bg-pink-500'
                  }`}>
                    {message.isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                  </div>
                  <motion.div
                    layout
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isBot 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-pink-500 text-white'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10 backdrop-blur-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}