import React, { useState } from 'react';
import { 
  Check, Crown, Zap, Palette, Download, Users, 
  Sparkles, ArrowRight, Star, Gift, Rocket, Heart,
  Coffee, TrendingUp, Shield, Target, Lightbulb,
  DollarSign, Flame, Diamond, Trophy, ArrowLeft,
  Clock, AlertTriangle, HelpCircle, Info, Layers
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (plan: 'free' | 'starter' | 'pro') => void;
  onBack: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Discover the power of AI-generated design systems for free.',
      price: { monthly: 0, yearly: 0 },
      badge: 'Free Forever',
      badgeColor: 'from-emerald-500 to-teal-600',
      emoji: '🎨',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      features: [
        '3 AI Design System Generations daily (approx. 90/month)',
        'Powered by Gemini 2.5 Flash Model',
        'Basic documentation',
        '1 active project',
        'Community support'
      ],
      cta: 'Start Creating Free',
      highlight: false,
      savings: null,
      popular: false,
      available: true // Added 'available' property for consistency, assuming it's usable
    },
    {
      id: 'solo-creator',
      name: 'Solo Creator',
      description: 'More generations for individual designers and developers.',
      price: { monthly: 2.99, yearly: 29 },
      badge: 'Great Value!',
      badgeColor: 'from-fuchsia-500 to-violet-600',
      emoji: '💡',
      gradient: 'from-fuchsia-400 via-violet-500 to-indigo-600',
      features: [
        '10 AI Design System Generations daily (approx. 300/month)',
        'Powered by Gemini 2.5 Flash Model',
        'Comprehensive documentation',
        '5 active projects',
        'Basic component library output',
        'Priority email support'
      ],
      cta: 'Get Started',
      highlight: false,
      savings: ((2.99 * 12) - 29).toFixed(2), // Calculate yearly savings dynamically
      popular: false,
      available: true
    },
    {
      id: 'advanced-creator',
      name: 'Advanced Creator',
      description: 'Unlock voice AI and expanded generations for serious creative work.',
      price: { monthly: 39, yearly: 399 },
      badge: 'Feature Rich',
      badgeColor: 'from-yellow-400 to-orange-500',
      emoji: '🔥',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      features: [
        '25 AI Design System Generations daily (approx. 750/month)',
        'Powered by Gemini 2.5 Flash Model',
        'Voice AI for explanations (up to 100,000 characters/month)', // Explicit limit
        'Enhanced documentation',
        '15 active projects',
        'Dedicated email support'
      ],
      cta: 'Upgrade Now',
      highlight: true,
      savings: ((39 * 12) - 399).toFixed(2), // Calculate yearly savings dynamically
      popular: true,
      available: true
    },
    {
      id: 'team-pro',
      name: 'Team Pro',
      description: 'Accelerate design system creation for professional teams.',
      price: { monthly: 139, yearly: 1399 },
      badge: 'Most Popular',
      badgeColor: 'from-blue-500 to-indigo-600',
      emoji: '🚀',
      gradient: 'from-blue-400 via-indigo-500 to-purple-600',
      features: [
        '50 AI Design System Generations daily (approx. 1,500/month)',
        'Powered by Gemini 2.5 Pro (higher quality)',
        'Voice AI for explanations (up to 500,000 characters/month)', // Explicit limit
        'Advanced documentation & guidelines',
        'Full component library output (React, Vue, etc.)',
        '25 active projects',
        'Version control integration (Git)',
        'Dedicated email support'
      ],
      cta: 'Start 7-Day Free Trial',
      highlight: true,
      savings: ((139 * 12) - 1399).toFixed(2), // Calculate yearly savings dynamically
      popular: true,
      available: true
    },
    {
      id: 'studio',
      name: 'Studio',
      description: 'Empower your design studio with advanced AI capabilities.',
      price: { monthly: 239, yearly: 2399 },
      badge: 'Coming Soon',
      badgeColor: 'from-orange-500 to-red-600',
      emoji: '✨',
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      features: [
        '100 AI Design System Generations daily (approx. 3,000/month)',
        'Powered by Gemini 2.5 Pro',
        'Voice AI for explanations (ElevenLabs)', // Implies high/no practical limit in terms of feature description
        'Advanced documentation & interactive examples',
        'Full component library + theming options',
        '50 active projects',
        'Team collaboration features',
        'Priority chat support'
      ],
      cta: 'Coming Soon',
      highlight: false,
      savings: ((239 * 12) - 2399).toFixed(2), // Calculate yearly savings dynamically
      popular: false,
      available: false,
      inProgress: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Comprehensive automation for large organizations and high volume needs.',
      price: { monthly: 399, yearly: 3999 },
      badge: 'Coming Soon',
      badgeColor: 'from-gray-500 to-gray-600',
      emoji: '⚡',
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      features: [
        '200 AI Design System Generations daily (approx. 6,000/month)',
        'Powered by Gemini 2.5 Pro',
        'Voice AI for explanations (ElevenLabs)', // Implies high/no practical limit
        'Customizable documentation templates',
        'Advanced component library + motion design tokens',
        'Unlimited active projects',
        'Advanced analytics & usage insights',
        'API access for custom integrations',
        'Dedicated account manager',
        '24/7 priority support'
      ],
      cta: 'Coming Soon',
      highlight: false,
      savings: ((399 * 12) - 3999).toFixed(2), // Calculate yearly savings dynamically
      popular: false,
      available: false,
      inProgress: true
    },
    {
      id: 'custom-enterprise',
      name: 'Custom Enterprise',
      description: 'Tailored solutions and dedicated support for large organizations with unique requirements.',
      price: { monthly: 'Custom', yearly: 'Custom' },
      badge: 'Contact Sales',
      badgeColor: 'from-purple-500 to-pink-600',
      emoji: '�',
      gradient: 'from-purple-400 via-pink-500 to-red-600',
      features: [
        'Custom AI generation quota',
        'Custom AI model selection (e.g., GPT-4o, Claude Opus, fine-tuned models)',
        'Custom ElevenLabs voice integration',
        'On-premise deployment options',
        'Dedicated engineering support',
        'SLA (Service Level Agreement)'
      ],
      cta: 'Contact Sales',
      highlight: false,
      savings: null,
      popular: false,
      available: false,
      inProgress: true
    }
];

  // Feature development status
  const featureStatus = {
    fullComponentLibrary: {
      status: 'in-progress',
      message: 'Our team is currently building a comprehensive component library with React, Vue, and other framework support.'
    },
    gitIntegration: {
      status: 'in-progress',
      message: 'Version control integration is under active development and will be available soon.'
    },
    advancedDocumentation: {
      status: 'in-progress',
      message: 'Enhanced documentation features with interactive examples are coming soon.'
    },
    teamCollaboration: {
      status: 'planned',
      message: 'Team collaboration features are on our roadmap for Q3 2025.'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Properly Aligned */}
          <div className="mb-20">
            {/* Back Button - Aligned Left */}
            <div className="mb-8">
              <button
                onClick={onBack}
                className="inline-flex items-center space-x-2 text-dark-600 hover:text-primary-500 transition-all duration-300 group hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            
            {/* Title Section - Centered */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full px-8 py-3 mb-8 backdrop-blur-xl">
                <Gift className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-semibold">Simple Pricing • No Hidden Fees • Cancel Anytime</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-dark-900 mb-6 leading-tight">
                Unlock Your
                <span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Design Potential
                </span>
              </h1>
              <p className="text-2xl text-dark-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                Choose the perfect plan to accelerate your creative workflow. 
                Start free and scale as you grow.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-dark-200/50 backdrop-blur-xl rounded-3xl p-2 border-2 border-dark-300/30 shadow-xl">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl transform scale-105'
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-300/30'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl transform scale-105'
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-300/30'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-20">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-3xl p-6 transition-all duration-500 transform ${plan.available ? 'hover:scale-105' : 'opacity-90'} ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-primary-500/10 via-primary-600/15 to-primary-700/10 border-3 border-primary-500/50 shadow-3xl ring-4 ring-primary-500/20 scale-105'
                    : 'bg-dark-200/40 backdrop-blur-2xl border-2 border-dark-300/30 hover:border-primary-500/50 shadow-2xl hover:shadow-3xl'
                } ${hoveredPlan === plan.id ? 'shadow-3xl' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`bg-gradient-to-r ${plan.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center space-x-2 animate-bounce`}>
                      <Flame className="w-4 h-4" />
                      <span>{plan.badge}</span>
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {!plan.available && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`bg-gradient-to-r ${plan.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center space-x-2`}>
                      {plan.inProgress ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>{plan.badge}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>{plan.badge}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3 animate-float">{plan.emoji}</div>
                  <h3 className="text-xl font-black text-dark-900 mb-2">{plan.name}</h3>
                  <p className="text-dark-600 mb-4 text-sm leading-relaxed">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center mb-2">
                      {typeof plan.price[billingCycle] === 'string' ? (
                        <span className="text-4xl font-black text-dark-900">
                          {plan.price[billingCycle]}
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-black text-dark-900">
                            ${plan.price[billingCycle]}
                          </span>
                          {plan.price[billingCycle] > 0 && (
                            <span className="text-dark-600 ml-2 text-lg font-semibold">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {plan.savings && billingCycle === 'yearly' && (
                      <div className="inline-flex items-center space-x-1 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-bold text-xs">{plan.savings}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => plan.available ? onSelectPlan(plan.id as any) : null}
                    disabled={!plan.available}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 transform ${plan.available ? 'hover:scale-105' : 'cursor-not-allowed opacity-80'} shadow-lg hover:shadow-xl ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white'
                        : plan.id === 'explorer'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                        : plan.id === 'solo-creator'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : !plan.available && plan.id === 'custom-enterprise'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : !plan.available
                        ? 'bg-dark-300/70 text-dark-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {plan.id === 'explorer' ? <Gift className="w-4 h-4" /> : 
                       plan.highlight ? <Rocket className="w-4 h-4" /> : 
                       plan.id === 'custom-enterprise' ? <HelpCircle className="w-4 h-4" /> :
                       !plan.available ? <Clock className="w-4 h-4" /> :
                       <Crown className="w-4 h-4" />}
                      <span>{plan.cta}</span>
                    </div>
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-black text-dark-800 flex items-center space-x-2 text-sm">
                    <Diamond className="w-4 h-4 text-primary-500" />
                    <span>What's included:</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => {
                      // Check if feature is in progress
                      const isInProgress = 
                        (feature.includes('Full component library') && featureStatus.fullComponentLibrary.status === 'in-progress') ||
                        (feature.includes('Version control') && featureStatus.gitIntegration.status === 'in-progress') ||
                        (feature.includes('Advanced documentation') && featureStatus.advancedDocumentation.status === 'in-progress') ||
                        (feature.includes('Team collaboration') && featureStatus.teamCollaboration.status === 'planned');
                      
                      return (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-white font-bold" />
                          </div>
                          <div>
                            <span className="text-dark-700 text-sm font-medium leading-relaxed">{feature}</span>
                            {isInProgress && !plan.available && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-600">
                                In Progress
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Value Indicator */}
                <div className="mt-6 pt-4 border-t border-dark-300/30">
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <Trophy className="w-3 h-3 text-primary-500" />
                    <span className="text-dark-600 font-semibold">
                      {plan.id === 'explorer' ? 'Perfect for beginners' :
                       plan.id === 'solo-creator' ? 'Great for freelancers' :
                       plan.id === 'team-pro' ? 'Best for professionals' :
                       plan.id === 'studio' ? 'Ideal for design teams' :
                       plan.id === 'enterprise' ? 'For large organizations' :
                       'Custom enterprise solution'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-br from-primary-500/10 via-primary-600/15 to-primary-700/10 border-2 border-primary-500/30 rounded-4xl p-12 backdrop-blur-2xl shadow-3xl">
              <h2 className="text-4xl font-black text-dark-900 mb-6">
                Why Choose AuraGen AI 💖
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">10x Faster</h3>
                  <p className="text-dark-600">Create design systems in minutes, not hours</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">AI-Powered</h3>
                  <p className="text-dark-600">Smart suggestions that understand design</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">Production Ready</h3>
                  <p className="text-dark-600">Export to CSS, Figma, and more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-dark-200/50 to-dark-300/50 backdrop-blur-2xl border-2 border-primary-500/30 rounded-4xl p-12 shadow-3xl">
              <h2 className="text-4xl font-black text-dark-900 mb-4">
                Ready to Transform Your Workflow? ✨
              </h2>
              <p className="text-xl text-dark-600 mb-8 max-w-2xl mx-auto">
                Join thousands of designers creating faster and better with AuraGen AI
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => onSelectPlan('explorer')}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-800 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                >
                  <div className="relative flex items-center space-x-3">
                    <Gift className="w-6 h-6" />
                    <span>Start Free - No Credit Card</span>
                    <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                </button>
                <button
                  onClick={() => onSelectPlan('team-pro')}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                >
                  <div className="relative flex items-center space-x-3">
                    <Rocket className="w-6 h-6" />
                    <span>Try Team Pro - 7 Days Free</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </button>
              </div>
              <p className="text-dark-500 text-lg mt-6 font-semibold">30-day money-back guarantee • Cancel anytime • No hidden fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing icon component
const FileText = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
};

// Add missing icon component
const GitBranch = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
};

// Add missing icon component
const Calendar = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
};