import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowRight, Sparkles, Zap, Palette, Users, Building, Shield, Globe, Crown } from 'lucide-react';
import { Message } from '../types';

interface ConversationViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  darkMode: boolean;
  hasMoodboard: boolean;
  onViewMoodboard: () => void;
  user?: any;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  darkMode,
  hasMoodboard,
  onViewMoodboard,
  user
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDesignOptions, setShowDesignOptions] = useState(false);
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
      setShowDesignOptions(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setShowDesignOptions(false);
  };

  const designTypes = [
    {
      icon: Users,
      title: "User Interface",
      description: "Consumer-facing app or website",
      color: "from-blue-500 to-cyan-500",
      prompt: "I want to create a user-friendly interface for a consumer app with modern, approachable design"
    },
    {
      icon: Building,
      title: "Business/Corporate",
      description: "Professional business application",
      color: "from-gray-600 to-gray-800",
      prompt: "I need a professional, corporate design system for a business application with clean, trustworthy aesthetics"
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Administrative control panel",
      color: "from-red-500 to-orange-500",
      prompt: "I want to design an admin dashboard with clear data visualization and efficient workflow design"
    },
    {
      icon: Globe,
      title: "Multi-Purpose",
      description: "Versatile design system",
      color: "from-purple-500 to-pink-500",
      prompt: "I need a versatile design system that works for multiple contexts - user interface, admin, and business pages"
    }
  ];

  const creativePrompts = [
    "Create a modern, minimalist design with calming colors and clean typography",
    "Design something bold and energetic for a fitness or sports application",
    "I want a warm, welcoming interface perfect for a community or social platform",
    "Create a futuristic, tech-focused design with innovative UI elements",
    "Design a luxury, elegant interface with sophisticated color palette",
    "I need a playful, creative design for an educational or children's app"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      {messages.length === 0 && (
        <div className="text-center py-16 mb-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-2xl">
              <Sparkles className="w-12 h-12 text-dark-50 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
            Welcome to AuraGen AI
          </h2>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            I'm here to help you create stunning UI design systems. Let's start by understanding what you want to build.
          </p>

          {/* Authentication Status */}
          {!user && (
            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-primary-600">Sign up for free to get:</span>
              </div>
              <ul className="text-sm text-dark-700 space-y-1 text-left">
                <li>• 3 AI generations per day</li>
                <li>• 2 saved projects</li>
                <li>• Voice AI responses</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
          )}

          {/* Design Type Selection */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-dark-900">What are you designing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {designTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(type.prompt)}
                  className="group p-6 rounded-3xl bg-dark-100/80 hover:bg-dark-200/80 border border-dark-300/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-xl"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-dark-900 group-hover:text-primary-600 transition-colors">
                    {type.title}
                  </h4>
                  <p className="text-sm text-dark-600 group-hover:text-dark-700 transition-colors">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Creative Prompts */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent flex-1"></div>
              <div className="flex items-center space-x-2 text-primary-600">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Or get creative</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {creativePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="p-4 text-left rounded-2xl bg-dark-100/60 hover:bg-dark-200/60 border border-dark-300/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg group backdrop-blur-sm"
                >
                  <p className="text-dark-700 group-hover:text-primary-600 transition-colors leading-relaxed">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Surprise Me Option */}
          <button
            onClick={() => handleQuickPrompt("Surprise me! Create a unique and innovative design system that showcases your creativity.")}
            className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-dark-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>Surprise Me!</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-8 mb-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
            >
              <div
                className={`
                  max-w-[85%] rounded-3xl px-8 py-6 transition-all duration-300 shadow-lg hover:shadow-xl
                  ${message.sender === 'ai' 
                    ? 'bg-dark-100/90 backdrop-blur-xl border border-dark-200/50 text-dark-800' 
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-xl'
                  }
                `}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className={`mt-3 text-sm ${message.sender === 'ai' ? 'text-dark-500' : 'text-dark-100/80'}`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start fade-in">
              <div className="bg-dark-100/90 backdrop-blur-xl border border-dark-200/50 rounded-3xl px-8 py-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  <span className="text-dark-600">
                    AuraGen AI is crafting your perfect design...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Moodboard CTA */}
      {hasMoodboard && (
        <div className="mb-8 text-center">
          <button
            onClick={onViewMoodboard}
            className="group relative overflow-hidden inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-dark-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3">
              <Palette className="w-6 h-6" />
              <span>View Your Moodboard</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-dark-100/95 backdrop-blur-2xl rounded-3xl p-6 border border-primary-500/30 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={user ? "Describe your design vision..." : "Sign up to start creating..."}
            disabled={isLoading || !user}
            className="flex-1 bg-dark-200/80 border border-dark-300/50 rounded-2xl px-6 py-4 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 focus:bg-dark-100 disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !user}
            className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-dark-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Send className="w-5 h-5" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};