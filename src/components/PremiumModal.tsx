import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Zap, Palette, Download, Sparkles } from 'lucide-react';
import { getOfferings, purchasePackage } from '../services/revenuecat';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  feature?: string;
  limit?: number;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  feature,
  limit
}) => {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOfferings();
    }
  }, [isOpen]);

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const offers = await getOfferings();
      setOfferings(offers);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageToPurchase: any) => {
    setPurchasing(true);
    try {
      await purchasePackage(packageToPurchase);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(false);
    }
  };

  if (!isOpen) return null;

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'Unlimited AI Generations',
      description: 'Generate as many design systems as you want'
    },
    {
      icon: Palette,
      title: 'Advanced Color Palettes',
      description: 'Access to premium color schemes and dark mode palettes'
    },
    {
      icon: Download,
      title: 'Unlimited Exports',
      description: 'Export your designs in multiple formats'
    },
    {
      icon: Crown,
      title: 'Priority Support',
      description: 'Get help faster with premium support'
    },
    {
      icon: Sparkles,
      title: 'Early Access',
      description: 'Be the first to try new features and improvements'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900">Upgrade to Premium</h2>
                <p className="text-dark-600">
                  {feature ? `You've reached your ${feature} limit (${limit})` : 'Unlock unlimited design power'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
            >
              <X className="w-5 h-5 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-dark-200/30 border border-dark-300/30">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-dark-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-dark-600">Loading pricing options...</p>
            </div>
          ) : offerings.length > 0 ? (
            <div className="space-y-4">
              {offerings.map((offering, index) => (
                <div key={index} className="border-2 border-primary-500/30 rounded-2xl p-6 bg-gradient-to-r from-primary-500/10 to-primary-600/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark-900">{offering.identifier}</h3>
                      <p className="text-dark-600">Full access to all premium features</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ${offering.availablePackages?.[0]?.product?.price || '9.99'}
                      </div>
                      <div className="text-sm text-dark-500">per month</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(offering.availablePackages?.[0])}
                    disabled={purchasing}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {purchasing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Upgrade Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30 mb-6">
                <Crown className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-2">Premium Coming Soon!</h3>
                <p className="text-dark-600">
                  We're preparing amazing premium features for you. For now, enjoy the free tier!
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Continue with Free Tier
              </button>
            </div>
          )}

          {/* Benefits Summary */}
          <div className="mt-8 p-4 rounded-xl bg-dark-200/30 border border-dark-300/30">
            <h4 className="font-semibold text-dark-900 mb-2 flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>What you get with Premium:</span>
            </h4>
            <ul className="text-sm text-dark-600 space-y-1">
              <li>• Unlimited AI-powered design generations</li>
              <li>• Advanced color palette options</li>
              <li>• Export designs in multiple formats</li>
              <li>• Priority customer support</li>
              <li>• Early access to new features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};