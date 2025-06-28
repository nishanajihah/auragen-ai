import React, { createContext, useContext, useState, useEffect } from 'react';

interface RevenueCatContextType {
  isInitialized: boolean;
  customerInfo: any;
  offerings: any[];
  isPremium: boolean;
  initializeRevenueCat: (userId: string) => Promise<void>;
  purchasePackage: (packageToPurchase: any) => Promise<any>;
  restorePurchases: () => Promise<any>;
  getCustomerInfo: () => Promise<any>;
  error: string | null;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeRevenueCat = async (userId: string) => {
    try {
      setError(null);
      console.log('Initializing RevenueCat for user:', userId);
      
      // Mock initialization - replace with actual RevenueCat SDK
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsInitialized(true);
      
      // Load customer info and offerings
      await Promise.all([
        loadCustomerInfo(),
        loadOfferings()
      ]);
      
    } catch (err) {
      console.error('RevenueCat initialization failed:', err);
      setError('Failed to initialize payment system');
    }
  };

  const loadCustomerInfo = async () => {
    try {
      // Mock customer info - replace with actual RevenueCat call
      const mockCustomerInfo = {
        originalAppUserId: 'user_123',
        entitlements: {
          active: {}
        },
        activeSubscriptions: []
      };
      
      setCustomerInfo(mockCustomerInfo);
      setIsPremium(Object.keys(mockCustomerInfo.entitlements.active).length > 0);
      
      return mockCustomerInfo;
    } catch (err) {
      console.error('Failed to load customer info:', err);
      setError('Failed to load subscription status');
      return null;
    }
  };

  const loadOfferings = async () => {
    try {
      // Mock offerings - replace with actual RevenueCat call
      const mockOfferings = [
        {
          identifier: 'premium_monthly',
          availablePackages: [{
            identifier: 'monthly',
            product: {
              identifier: 'premium_monthly',
              price: 9.99,
              priceString: '$9.99',
              currencyCode: 'USD',
              title: 'AuraGen AI Premium Monthly',
              description: 'Unlimited access to all features'
            }
          }]
        },
        {
          identifier: 'premium_yearly',
          availablePackages: [{
            identifier: 'yearly',
            product: {
              identifier: 'premium_yearly',
              price: 99.99,
              priceString: '$99.99',
              currencyCode: 'USD',
              title: 'AuraGen AI Premium Yearly',
              description: 'Unlimited access to all features - Save 17%'
            }
          }]
        }
      ];
      
      setOfferings(mockOfferings);
      return mockOfferings;
    } catch (err) {
      console.error('Failed to load offerings:', err);
      setError('Failed to load pricing information');
      return [];
    }
  };

  const purchasePackage = async (packageToPurchase: any) => {
    try {
      setError(null);
      console.log('Purchasing package:', packageToPurchase);
      
      // Mock purchase - replace with actual RevenueCat call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful purchase
      const updatedCustomerInfo = {
        ...customerInfo,
        entitlements: {
          active: {
            premium: {
              identifier: 'premium',
              isActive: true,
              willRenew: true,
              periodType: 'NORMAL',
              latestPurchaseDate: new Date().toISOString(),
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        }
      };
      
      setCustomerInfo(updatedCustomerInfo);
      setIsPremium(true);
      
      return { customerInfo: updatedCustomerInfo };
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Purchase failed. Please try again.');
      throw err;
    }
  };

  const restorePurchases = async () => {
    try {
      setError(null);
      console.log('Restoring purchases...');
      
      // Mock restore - replace with actual RevenueCat call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await loadCustomerInfo();
      
      return customerInfo;
    } catch (err) {
      console.error('Restore purchases failed:', err);
      setError('Failed to restore purchases');
      throw err;
    }
  };

  const getCustomerInfo = async () => {
    return await loadCustomerInfo();
  };

  const value: RevenueCatContextType = {
    isInitialized,
    customerInfo,
    offerings,
    isPremium,
    initializeRevenueCat,
    purchasePackage,
    restorePurchases,
    getCustomerInfo,
    error
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};