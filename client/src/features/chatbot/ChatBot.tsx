import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, Bot, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Find farmer schemes",
  "Which scholarships can I apply for?",
  "Find government jobs",
  "What documents do I need for Aadhar?"
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am OneGuide AI. How can I help you discover government schemes, scholarships, or services today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    // Remove previous errors before adding new message
    const cleanMessages = messages.filter(m => !m.isError);
    const newMessages = [...cleanMessages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/ai/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      }, {
        withCredentials: true // To pass the optional JWT token for personalization
      });

      if (response.data?.data) {
        setMessages([...newMessages, response.data.data]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error while processing your request. Please try again.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleRetry = () => {
    const cleanMessages = messages.filter(m => !m.isError);
    if (cleanMessages.length > 0 && cleanMessages[cleanMessages.length - 1].role === 'user') {
      const lastUserMsg = cleanMessages.pop();
      setMessages(cleanMessages);
      if (lastUserMsg) handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 flex items-center justify-center transition-all ${
          isOpen ? 'hidden' : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white'
        }`}
      >
        <svg 
          className="w-6 h-6 animate-pulse" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5.5" r="3" />
          <path d="M4 21v-2c0-2.5 2.5-4 5.5-4.5" />
          <path d="M20 21v-2c0-2.5-2.5-4-5.5-4.5" />
          <path d="M12 10.5l-1.5 2.5v2.5l1.5 1.5 1.5-1.5v-2.5z" fill="currentColor" stroke="none" />
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:h-[600px] sm:max-w-[400px] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col border-0 sm:border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">OneGuide AI</h3>
                  <p className="text-blue-100 text-xs font-medium">Government Guidance Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50 scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-primary-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div 
                      className={`p-3.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : msg.isError
                            ? 'bg-red-50 text-red-800 border border-red-100 rounded-bl-sm'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm prose prose-sm prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed'
                      }`}
                    >
                      {msg.role === 'assistant' && !msg.isError ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    
                    {msg.isError && (
                      <button 
                        onClick={handleRetry}
                        className="self-start text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <RefreshCcw size={12} /> Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-end gap-2.5 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white border border-gray-200 text-primary-600 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="max-w-[75%] p-3.5 rounded-2xl bg-white border border-gray-100 rounded-bl-sm shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary-600" />
                    <span className="text-gray-500 text-sm font-medium">Analyzing database...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 p-3 shrink-0">
              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide snap-x">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="whitespace-nowrap bg-gray-50 border border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 text-[13px] px-3 py-1.5 rounded-full transition-colors font-medium snap-start"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={onSubmit} className="flex items-end gap-2 bg-gray-50 rounded-xl p-1.5 border border-gray-200 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question... (Shift+Enter for new line)"
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none px-3 py-2 text-[15px] max-h-[120px] outline-none min-h-[44px]"
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors shrink-0 shadow-sm mb-0.5 mr-0.5"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                 <p className="text-[10px] text-gray-400">AI can make mistakes. Verify critical information on official portals.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
