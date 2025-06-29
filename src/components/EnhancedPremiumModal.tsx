import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Zap, Palette, Download, Sparkles, Star, TrendingUp, Shield } from 'lucide-react';
import { useRevenueCat } from './RevenueCatProvider';

interface EnhancedPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  feature?: string;
  limit?: number;
}

export const EnhancedPremiumModal: React.FC<EnhancedPremiumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  feature,
  limit
}) => {
  const { offerings, purchasePackage, error } = useRevenueCat();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [purchasing, setPurchasing] = useState(false);

  const plans = {
    monthly: {
      id: 'premium_monthly',
      name: 'Monthly',
      price: 9.99,
      priceString: '$9.99',
      period: 'month',
      savings: null,
      popular: false
    },
    yearly: {
      id: 'premium_yearly',
      name: 'Yearly',
      price: 99.99,
      priceString: '$99.99',
      period: 'year',
      savings: 'Save 17%',
      popular: true
    }
  };

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'Unlimited AI Generations',
      description: 'Generate as many design systems as you want',
      highlight: feature === 'generation'
    },
    {
      icon: Palette,
      title: 'Advanced Color Palettes',
      description: 'Access to premium color schemes and dark mode palettes',
      highlight: false
    },
    {
      icon: Download,
      title: 'Unlimited Exports',
      description: 'Export your designs in multiple formats',
      highlight: feature === 'export'
    },
    {
      icon: Crown,
      title: 'Priority Support',
      description: 'Get help faster with premium support',
      highlight: false
    },
    {
      icon: Sparkles,
      title: 'Early Access',
      description: 'Be the first to try new features and improvements',
      highlight: false
    }
  ];

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const selectedOffering = offerings.find(o => o.identifier === plans[selectedPlan].id);
      if (selectedOffering?.availablePackages?.[0]) {
        await purchasePackage(selectedOffering.availablePackages[0]);
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-dark-900">Upgrade to Premium</h2>
                <p className="text-lg text-dark-600">
                  {feature ? `You've reached your ${feature} limit (${limit})` : 'Unlock unlimited design power'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
            >
              <X className="w-6 h-6 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dark-900 mb-4 text-center">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {Object.entries(plans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedPlan === key
                      ? 'border-primary-500 bg-primary-500/10 shadow-xl'
                      : 'border-dark-300/30 bg-dark-200/30 hover:border-primary-400/50 hover:bg-primary-500/5'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-dark-900">{plan.name}</h4>
                    {plan.savings && (
                      <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-black text-dark-900">{plan.priceString}</div>
                    <div className="text-dark-600">per {plan.period}</div>
                  </div>
                  
                  <div className="text-sm text-dark-600">
                    {key === 'yearly' ? 'Best value - 2 months free!' : 'Perfect for trying premium features'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dark-900 mb-6 text-center">Premium Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    feature.highlight 
                      ? 'border-primary-500 bg-primary-500/10 shadow-xl' 
                      : 'border-dark-300/30 bg-dark-200/30'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl shadow-lg ${
                      feature.highlight 
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-dark-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-8 bg-dark-200/30 rounded-2xl p-6 border border-dark-300/30">
            <h4 className="font-bold text-dark-900 mb-4 text-center">Free vs Premium</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-semibold text-dark-800">Feature</div>
              <div className="font-semibold text-dark-800 text-center">Free</div>
              <div className="font-semibold text-dark-800 text-center">Premium</div>
              
              <div className="text-dark-700">AI Generations</div>
              <div className="text-center text-dark-600">3/day</div>
              <div className="text-center text-green-600 font-semibold">Unlimited</div>
              
              <div className="text-dark-700">Saved Projects</div>
              <div className="text-center text-dark-600">2 total</div>
              <div className="text-center text-green-600 font-semibold">Unlimited</div>
              
              <div className="text-dark-700">Daily Exports</div>
              <div className="text-center text-dark-600">1/day</div>
              <div className="text-center text-green-600 font-semibold">Unlimited</div>
              
              <div className="text-dark-700">Support</div>
              <div className="text-center text-dark-600">Community</div>
              <div className="text-center text-green-600 font-semibold">Priority</div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {/* Purchase Button */}
          <div className="text-center">
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {purchasing ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Crown className="w-6 h-6" />
                  <span>Upgrade to Premium - {plans[selectedPlan].priceString}</span>
                  <TrendingUp className="w-6 h-6" />
                </div>
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-dark-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};