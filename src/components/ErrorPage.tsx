import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Home, RefreshCw, ArrowLeft, Sparkles, 
  Search, Coffee, Zap, Heart, Star, Rocket, Shield
} from 'lucide-react';

interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  message?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
  showRefresh?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = '404',
  title = 'Page Not Found',
  message = 'Sorry, the page you are looking for doesn\'t exist or has been moved.',
  onGoHome,
  onGoBack,
  showRefresh = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setIsVisible(true);
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  // Enhanced designs based on error code
  const getErrorDesign = () => {
    switch (errorCode) {
      case '404':
        return {
          gradient: 'from-blue-400 via-purple-500 to-pink-500',
          bgGradient: 'from-blue-500/5 via-purple-500/10 to-pink-500/5',
          borderColor: 'border-blue-500/20',
          icon: Search,
          illustration: '🔍',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500',
          subtitle: 'Lost in Space',
          funMessage: "This page went on an adventure and forgot to leave a map!"
        };
      case '500':
        return {
          gradient: 'from-red-400 via-orange-500 to-yellow-500',
          bgGradient: 'from-red-500/5 via-orange-500/10 to-yellow-500/5',
          borderColor: 'border-red-500/20',
          icon: Zap,
          illustration: '⚡',
          color: 'text-red-500',
          bgColor: 'bg-red-500',
          subtitle: 'System Overload',
          funMessage: "Our servers are having a coffee break. They'll be back soon!"
        };
      case '403':
        return {
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          bgGradient: 'from-yellow-500/5 via-orange-500/10 to-red-500/5',
          borderColor: 'border-yellow-500/20',
          icon: Shield,
          illustration: '🛡️',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500',
          subtitle: 'Access Denied',
          funMessage: "This area is VIP only. Maybe try knocking first?"
        };
      case '503':
        return {
          gradient: 'from-green-400 via-blue-500 to-purple-500',
          bgGradient: 'from-green-500/5 via-blue-500/10 to-purple-500/5',
          borderColor: 'border-green-500/20',
          icon: Coffee,
          illustration: '☕',
          color: 'text-green-500',
          bgColor: 'bg-green-500',
          subtitle: 'Under Maintenance',
          funMessage: "We're making things even more awesome. Grab a coffee!"
        };
      default:
        return {
          gradient: 'from-primary-400 via-primary-500 to-primary-600',
          bgGradient: 'from-primary-500/5 via-primary-500/10 to-primary-600/5',
          borderColor: 'border-primary-500/20',
          icon: AlertTriangle,
          illustration: '✨',
          color: 'text-primary-500',
          bgColor: 'bg-primary-500',
          subtitle: 'Oops!',
          funMessage: "Something unexpected happened, but we're on it!"
        };
    }
  };

  const design = getErrorDesign();
  const IconComponent = design.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 ${design.bgColor} rounded-full opacity-20 animate-float`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-64 h-64 bg-gradient-to-r ${design.gradient} rounded-full opacity-10 blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r ${design.gradient} rounded-full opacity-5 blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${design.gradient} rounded-full opacity-5 blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-4xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Main Error Display */}
          <div className="mb-12">
            {/* Large Error Code with Animation */}
            <div className="relative mb-8">
              <div className="text-[12rem] md:text-[16rem] font-black leading-none opacity-10 text-dark-300 select-none">
                {errorCode}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-8xl md:text-9xl animate-bounce`}>
                  {design.illustration}
                </div>
              </div>
            </div>

            {/* Error Content Card */}
            <div className={`bg-gradient-to-br ${design.bgGradient} backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-dark-200/30 shadow-2xl hover:shadow-3xl transition-all duration-500`}>
              
              {/* Icon and Title */}
              <div className="flex items-center justify-center mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${design.gradient} shadow-xl animate-pulse`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className={`text-sm font-bold ${design.color} uppercase tracking-wider mb-2`}>
                {design.subtitle}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-dark-900 mb-4">
                {title}
              </h1>
              
              <p className="text-xl md:text-2xl text-dark-600 mb-4 leading-relaxed">
                {design.funMessage}
              </p>
              
              <p className="text-lg text-dark-500 mb-8">
                {message}
              </p>

              {/* Action Buttons - ALL SAME HEIGHT (py-5) */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <button
                  onClick={handleGoHome}
                  className={`group relative overflow-hidden bg-gradient-to-r ${design.gradient} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <Home className="w-6 h-6" />
                    <span>Take Me Home</span>
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                <button
                  onClick={handleGoBack}
                  className="group relative overflow-hidden bg-dark-200/80 hover:bg-dark-300/80 text-dark-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-dark-300/50 hover:border-primary-500/50 shadow-lg hover:shadow-xl backdrop-blur-xl transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Go Back</span>
                  </div>
                </button>

                {showRefresh && (
                  <button
                    onClick={handleRefresh}
                    className="group relative overflow-hidden bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-dark-300/50 hover:border-primary-500/50 shadow-lg hover:shadow-xl backdrop-blur-xl transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Refresh</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Fun Stats or Tips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-dark-300/30">
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${design.bgColor}/20 flex items-center justify-center`}>
                    <Heart className={`w-6 h-6 ${design.color}`} />
                  </div>
                  <h3 className="font-semibold text-dark-800 mb-1">We Care</h3>
                  <p className="text-sm text-dark-600">Your experience matters to us</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${design.bgColor}/20 flex items-center justify-center`}>
                    <Zap className={`w-6 h-6 ${design.color}`} />
                  </div>
                  <h3 className="font-semibold text-dark-800 mb-1">Fast Fix</h3>
                  <p className="text-sm text-dark-600">Our team is already on it</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${design.bgColor}/20 flex items-center justify-center`}>
                    <Star className={`w-6 h-6 ${design.color}`} />
                  </div>
                  <h3 className="font-semibold text-dark-800 mb-1">Better Soon</h3>
                  <p className="text-sm text-dark-600">Improvements are coming</p>
                </div>
              </div>
            </div>
          </div>

          {/* AuraGen AI Branding */}
          <div className="flex items-center justify-center space-x-3 text-dark-500">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                AuraGen AI
              </div>
              <div className="text-sm text-dark-500">
                Making design magical
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Specific Error Components with enhanced designs
export const NotFoundPage: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => (
  <ErrorPage
    errorCode="404"
    title="Page Not Found"
    message="Don't worry, even the best explorers get lost sometimes. Let's get you back to familiar territory!"
    onGoHome={onGoHome}
  />
);

export const ServerErrorPage: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => (
  <ErrorPage
    errorCode="500"
    title="Server Error"
    message="Our digital hamsters need a quick break. We're getting them back on their wheels ASAP!"
    onGoHome={onGoHome}
  />
);

export const ForbiddenPage: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => (
  <ErrorPage
    errorCode="403"
    title="Access Forbidden"
    message="This area requires special clearance. Maybe try a different route or contact our friendly support team!"
    onGoHome={onGoHome}
  />
);

export const MaintenancePage: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => (
  <ErrorPage
    errorCode="503"
    title="Under Maintenance"
    message="We're sprinkling some digital magic dust to make things even better. Perfect time for a coffee break!"
    onGoHome={onGoHome}
    showRefresh={true}
  />
);