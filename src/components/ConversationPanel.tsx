import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ConversationPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  darkMode: boolean;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  darkMode
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto conversation-scroll p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4 animate-float">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to AuraGen AI</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              I'm here to help you discover the perfect vibe for your UI design. 
              Tell me about the feeling you want your interface to evoke.
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-3xl px-6 py-4 transition-all duration-300 ease-in-out
                ${message.sender === 'ai' 
                  ? 'glass-morphism text-gray-800 dark:text-gray-200 hover:shadow-xl hover:backdrop-blur-2xl' 
                  : `${darkMode ? 'neu-morphism-dark' : 'neu-morphism-light'} text-gray-800 dark:text-gray-200`
                }
              `}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className="mt-2 text-xs opacity-60">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-morphism rounded-3xl px-6 py-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AuraGen AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div 
            className={`
              flex-1 relative transition-all duration-300
              ${darkMode ? 'neu-morphism-inset-dark' : 'neu-morphism-inset-light'}
              rounded-2xl
            `}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe the vibe you're looking for..."
              disabled={isLoading}
              className="w-full px-6 py-4 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm rounded-2xl"
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`
              px-6 py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              ${darkMode ? 'neu-morphism-dark hover:shadow-[4px_4px_8px_#000000,_-4px_-4px_8px_#1a1a1a]' : 'neu-morphism-light hover:shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff]'}
              ${!inputValue.trim() || isLoading ? '' : 'hover:scale-95 active:scale-90'}
            `}
          >
            <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </button>
        </form>
      </div>
    </div>
  );
};