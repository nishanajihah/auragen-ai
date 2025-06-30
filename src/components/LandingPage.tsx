import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Sparkles, ArrowRight, Play, Palette, Zap, Users, 
  Star, CheckCircle, Wand2, Layers, Type, Image,
  Globe, Smartphone, Monitor, Crown, Gift, TrendingUp,
  Shield, Clock, DollarSign, Flame, Diamond, Rocket,
  LogIn, UserPlus, Target, Lightbulb, Heart, Coffee
} from 'lucide-react';
import { analytics } from '../services/analytics';

// Lazy load heavy components
const LazyFeatureSection = lazy(() => import('./LazyComponents/LazyFeatureSection').then(module => ({ default: module.default })));
const LazyHowItWorks = lazy(() => import('./LazyComponents/LazyHowItWorks').then(module => ({ default: module.default })));

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onViewPricing?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, onViewPricing }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
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
            <div className="flex items-center space-x-3">
              {onViewPricing && (
                <button
                  onClick={() => {
                    onViewPricing();
                    analytics.track('pricing_button_clicked', { location: 'landing_nav' });
                  }}
                  className="text-dark-700 hover:text-dark-900 px-3 py-1.5 rounded-lg font-medium transition-all border border-dark-300/30 hover:border-primary-500/50 text-xs"
                >
                  Pricing
                </button>
              )}
              
              <button
                onClick={() => {
                  onSignIn();
                  analytics.track('sign_in_button_clicked', { location: 'landing_nav' });
                }}
                className="text-dark-700 hover:text-dark-900 px-3 py-1.5 rounded-lg font-medium transition-all border border-dark-300/30 hover:border-primary-500/50 text-xs"
              >
                Sign In
              </button>
              
              <button
                onClick={() => {
                  onGetStarted();
                  analytics.track('get_started_button_clicked', { location: 'landing_nav' });
                }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-xs"
              >
                Get Started Free
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
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
              <button
                onClick={() => {
                  onGetStarted();
                  analytics.track('get_started_button_clicked', { location: 'hero' });
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Wand2 className="w-5 h-5" />
                  <span>Start Creating for Free</span>
                </div>
              </button>

              {onViewPricing && (
                <button
                  onClick={() => {
                    onViewPricing();
                    analytics.track('pricing_button_clicked', { location: 'hero' });
                  }}
                  className="group relative overflow-hidden bg-dark-200/80 hover:bg-dark-300/80 text-dark-700 hover:text-dark-900 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 border-2 border-dark-300/50 hover:border-primary-500/50 shadow-lg hover:shadow-xl backdrop-blur-xl w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <span>View Pricing</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section - Lazy loaded */}
      <Suspense fallback={<div className="py-24 text-center">Loading features...</div>}>
        {hasScrolled && <LazyFeatureSection features={features} currentFeature={currentFeature} />}
      </Suspense>

      {/* How It Works - Lazy loaded */}
      <Suspense fallback={<div className="py-24 text-center">Loading content...</div>}>
        {hasScrolled && <LazyHowItWorks />}
      </Suspense>

      {/* CTA Section */}
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
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={() => {
                    onGetStarted();
                    analytics.track('get_started_button_clicked', { location: 'cta' });
                  }}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <span>Start Your Free Trial</span>
                  </div>
                </button>
                
                {onViewPricing && (
                  <button
                    onClick={() => {
                      onViewPricing();
                      analytics.track('pricing_button_clicked', { location: 'cta' });
                    }}
                    className="group relative overflow-hidden bg-dark-200/80 hover:bg-dark-300/80 text-dark-700 hover:text-dark-900 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 border-2 border-dark-300/50 hover:border-primary-500/50 shadow-lg hover:shadow-xl backdrop-blur-xl w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <Flame className="w-5 h-5" />
                      <span>View Pricing</span>
                    </div>
                  </button>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-dark-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold">No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold">30-Day Money Back</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold">Setup in 2 Minutes</span>
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
              <p>copyright={`© ${new Date().getFullYear()} AuraGen AI. All rights reserved.`}</p>
              <p className="text-sm mt-1">Empowering designers with AI-powered creativity</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};