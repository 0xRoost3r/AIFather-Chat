"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, m } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageSquare, Brain } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../index.css';
import useWindowSize from '../hooks/useWindowSize';
import { useBrand } from './BrandContext';
import { useChat } from '@ai-sdk/react';
import { MarkdownComponents } from './MarkdownContent';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { TokenThirdWebCard } from './tokenThirdWebCard';

// Background bubble component
const BackgroundBubble = ({ index }: { index: number }) => {
  const style = useMemo(() => ({
    background: index % 2 === 0 ? '#ff49db' : '#0055ff',
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
  }), [index]);

  const { width = 0, height = 0 } = useWindowSize();

  const animation = useMemo(() => ({
    x: [Math.random() * (width || 500), Math.random() * (width || 500)],
    y: [Math.random() * (height || 500), Math.random() * (height || 500)],
    scale: [1, 1.2, 1],
  }), [width, height]);

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

export default function ChatInterface() {
  const [showIntro, setShowIntro] = useState(true);
  const { brandInfo, subdomain } = useBrand();

  // Sử dụng useChat hook từ @ai-sdk/react
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: `/api/${subdomain}/chat`,
    initialMessages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        content: "Hey there, vitsing! I’m Grok 3, your AI sidekick from xAI, here to help you deploy smart contracts with ThirdWeb like a pro. Ready to code, deploy, and conquer the blockchain? Let’s make it happen!"
      }
    ],
    onResponse: () => {
      // Ẩn intro panel khi có tin nhắn đầu tiên
      setShowIntro(false);
    }
  });

  console.log(`ChatInterface rendering for: ${subdomain} with brand:`, brandInfo);

  // Memoize background bubbles
  const backgroundBubbles = useMemo(() => 
    [...Array(20)].map((_, i) => <BackgroundBubble key={i} index={i} />),
    []
  );

  // Xử lý form submit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
      setShowIntro(false);
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
              className="hidden md:flex w-1/3 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20 flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${brandInfo.primaryColor} flex items-center justify-center`}>
                  <Bot size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{brandInfo.name}</h2>
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
          <div className={`bg-gradient-to-r ${brandInfo.primaryColor} p-4`}>
            <h1 className="text-white text-xl font-bold">{brandInfo.chatTitle}</h1>
          </div>
          <div className="flex justify-end p-4">
            <ConnectButton />
          </div>
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.role === 'assistant' ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'assistant' ? brandInfo.accentColor : brandInfo.secondaryColor
                }`}>
                  {message.role === 'assistant' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'assistant' 
                      ? brandInfo.accentColor + ' text-white' 
                      : brandInfo.secondaryColor + ' text-white'
                  }`}
                >
                  {message.parts ? (
                    message.parts.map((part, idx) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <ReactMarkdown
                              key={idx}
                              remarkPlugins={[remarkGfm]}
                              components={MarkdownComponents}
                            >
                              {part.text}
                            </ReactMarkdown>
                          );

                        case 'tool-invocation': {
                          const callId = part.toolInvocation.toolCallId;
                          console.log(part.toolInvocation);
                          switch (part.toolInvocation.toolName) {
                            case 'tokenTemplate': {
                              switch (part.toolInvocation.state) {
                                case 'result':
                                  return (
                                    <TokenThirdWebCard 
                                      name={part.toolInvocation.args.name} 
                                      symbol={part.toolInvocation.args.symbol} 
                                    />
                                  );
                                case 'result':
                                  return (
                                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 my-2">
                                      <div className="flex items-center gap-2 text-white">
                                        <MessageSquare className="w-5 h-5" />
                                        Calling ThirdWeb to create a smart contract based on your request...
                                      </div>
                                    </div>
                                  );
                              }
                              break;
                            }
                          }
                        }
                      }
                    })
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            
            {/* Giữ lại loading state */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${brandInfo.accentColor}`}>
                  <Bot size={20} className="text-white" />
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${brandInfo.accentColor} text-white`}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10 backdrop-blur-xl">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                name="prompt"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${brandInfo.primaryColor} text-white px-4 py-2 rounded-xl flex items-center gap-2`}
              >
                <Send size={20} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/80 border border-red-500 rounded-md p-3 text-white text-sm">
          {error.message || "An error occurred during the conversation."}
        </div>
      )}
    </div>
  );
} 