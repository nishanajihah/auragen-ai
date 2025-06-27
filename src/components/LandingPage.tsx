import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Play, Palette, Zap, Users, 
  Star, CheckCircle, Wand2, Layers, Type, Image,
  Globe, Smartphone, Monitor, Crown, Gift, TrendingUp,
  Shield, Clock, DollarSign, Flame, Diamond, Rocket,
  LogIn, UserPlus, Target, Lightbulb, Heart, Coffee
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onViewPricing?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, onViewPricing }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Palette,
      title: "AI-Powered Color Palettes",
      description: "Generate stunning color schemes that perfectly match your brand vision"
    },
    {
      icon: Type,
      title: "Smart Typography Pairing",
      description: "Get perfect font combinations with Google Fonts integration"
    },
    {
      icon: Layers,
      title: "Interactive Components",
      description: "Complete component library with all states and variations"
    },
    {
      icon: Image,
      title: "Visual Inspiration",
      description: "AI-generated mood boards and design concepts"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      avatar: "SC",
      content: "AuraGen AI transformed my design workflow. What used to take hours now takes minutes!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Frontend Developer",
      avatar: "MR",
      content: "The component suggestions are spot-on. It's like having a senior designer on my team.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      avatar: "EW",
      content: "Our team's design consistency improved dramatically since using AuraGen AI.",
      rating: 5
    }
  ];

  const stats = [
    { number: "1,000+", label: "Design Systems Created", icon: TrendingUp },
    { number: "50+", label: "Happy Designers", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "4.9/5", label: "User Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 bg-dark-100/80 backdrop-blur-2xl border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                AuraGen AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {onViewPricing && (
                <button
                  onClick={onViewPricing}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    <Flame className="w-5 h-5 animate-pulse" />
                    <span>Premium Plans</span>
                    <Diamond className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                </button>
              )}
              
              {/* FIXED: Better designed Sign In button */}
              <button
                onClick={onSignIn}
                className="group relative overflow-hidden bg-dark-200/80 hover:bg-dark-300/80 text-dark-700 hover:text-dark-900 px-6 py-3 rounded-2xl font-bold transition-all duration-300 border-2 border-dark-300/50 hover:border-primary-500/50 shadow-lg hover:shadow-xl backdrop-blur-xl transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Sign In</span>
                </div>
              </button>
              
              <button
                onClick={onGetStarted}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started Free</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-6 py-2 mb-8">
              <Gift className="w-4 h-4 text-primary-500" />
              <span className="text-primary-600 font-medium">Free Plan Available - No Credit Card Required</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Design Systems
              </span>
              <br />
              <span className="text-dark-900">Made Simple</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-dark-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create stunning, professional design systems in minutes with AI. 
              From color palettes to complete component libraries - all powered by conversation.
            </p>

            {/* FIXED: All buttons same height (py-5) */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={onGetStarted}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <Wand2 className="w-6 h-6" />
                  <span>Start Creating for Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              {onViewPricing && (
                <button
                  onClick={onViewPricing}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <Flame className="w-6 h-6 animate-pulse" />
                    <span>Unlock Premium Power</span>
                    <Diamond className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 rounded-full bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                  <div className="text-dark-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-100/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              Everything You Need to Create
              <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Amazing Designs
              </span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Our AI understands design principles and creates cohesive, professional design systems 
              that would take hours to create manually.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
                  currentFeature === index
                    ? 'bg-gradient-to-br from-primary-500/10 to-primary-600/10 border-primary-500/50 shadow-xl'
                    : 'bg-dark-200/30 border-dark-300/30 hover:border-primary-500/50'
                }`}
              >
                <div className={`p-4 rounded-2xl mb-6 transition-all duration-300 ${
                  currentFeature === index
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg'
                    : 'bg-dark-300/50 group-hover:bg-primary-500/20'
                }`}>
                  <feature.icon className={`w-8 h-8 transition-colors duration-300 ${
                    currentFeature === index ? 'text-white' : 'text-dark-600 group-hover:text-primary-500'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-4">{feature.title}</h3>
                <p className="text-dark-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Creating professional design systems has never been easier. 
              Just describe your vision and watch the magic happen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe Your Vision",
                description: "Tell our AI about your project, brand, or the feeling you want to create. Be as specific or as general as you like.",
                icon: Sparkles
              },
              {
                step: "02",
                title: "AI Creates Your System",
                description: "Our AI generates a complete design system including colors, typography, components, and visual inspiration.",
                icon: Wand2
              },
              {
                step: "03",
                title: "Export & Implement",
                description: "Download your design system as CSS, JSON, or Figma tokens. Ready to use in your projects immediately.",
                icon: ArrowRight
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-4">{item.title}</h3>
                <p className="text-dark-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark-100/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              Trusted by Designers
              <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Everywhere
              </span>
            </h2>
            <p className="text-xl text-dark-600 max-w-2xl mx-auto">
              Join the growing community of designers who are creating faster and better with AuraGen AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-dark-200/30 backdrop-blur-xl rounded-3xl p-8 border border-dark-300/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-dark-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-dark-900">{testimonial.name}</div>
                    <div className="text-dark-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REDESIGNED CTA Section - More Catchy and Better Sized */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/15 via-purple-500/10 to-pink-500/15 backdrop-blur-2xl rounded-4xl border-2 border-primary-500/30 shadow-3xl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 text-center py-16 px-8">
              {/* Eye-catching Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-2xl mb-8 animate-float">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              
              {/* FIXED: More catchy headline */}
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Unleash Your Creative Genius
                </span>
                <br />
                <span className="text-dark-900">in Minutes, Not Hours!</span>
              </h2>
              
              <p className="text-xl text-dark-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of designers who've already discovered the secret to creating 
                <span className="font-bold text-primary-600"> stunning design systems </span>
                with the power of AI. Your next masterpiece is just one conversation away! ✨
              </p>
              
              {/* FIXED: Better sized buttons with consistent height (py-5) */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <button
                  onClick={onGetStarted}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <Crown className="w-6 h-6" />
                    <span>Start Your Free Journey</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </button>
                
                {onViewPricing && (
                  <button
                    onClick={onViewPricing}
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <Flame className="w-6 h-6 animate-pulse" />
                      <span>Discover Premium Magic</span>
                      <Rocket className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" />
                    </div>
                  </button>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-8 text-dark-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">30-Day Money Back</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">Setup in 2 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-100/80 backdrop-blur-xl border-t border-dark-300/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                AuraGen AI
              </span>
            </div>
            <div className="text-dark-600 text-center md:text-right">
              <p>&copy; 2024 AuraGen AI. All rights reserved.</p>
              <p className="text-sm mt-1">Empowering designers with AI-powered creativity</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};