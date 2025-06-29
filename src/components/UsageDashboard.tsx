import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Zap, FolderOpen, Download, Volume2, 
  TrendingUp, Calendar, Clock, AlertTriangle, Crown,
  RefreshCw, Target, Award, Flame
} from 'lucide-react';
import { getUserUsage, saveUsageData } from '../services/supabase';
import { getUserPlanLimits, checkUsageLimit, getPlanDisplayName, getPlanColor } from '../utils/planRestrictions';

interface UsageDashboardProps {
  user: any;
  onUpgradeClick: () => void;
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({ user, onUpgradeClick }) => {
  const [usageData, setUsageData] = useState({
    generations: 0,
    projects: 0,
    exports: 0,
    voiceCharacters: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  const planLimits = getUserPlanLimits(user);
  const planName = getPlanDisplayName(user?.user_metadata?.subscription_tier || 'free');
  const planColor = getPlanColor(user?.user_metadata?.subscription_tier || 'free');

  useEffect(() => {
    loadUsageData();
    const interval = setInterval(updateTimeUntilReset, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const loadUsageData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data } = await getUserUsage(user.id);
      setUsageData(data);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeUntilReset(`${hours}h ${minutes}m`);
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  const usageItems = [
    {
      icon: Zap,
      label: 'AI Generations',
      used: usageData.generations,
      limit: planLimits.generations.daily,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: FolderOpen,
      label: 'Projects',
      used: usageData.projects,
      limit: planLimits.projects.total,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Download,
      label: 'Exports',
      used: usageData.exports,
      limit: planLimits.exports.daily,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Volume2,
      label: 'Voice Characters',
      used: usageData.voiceCharacters,
      limit: planLimits.voice.charactersPerDay,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-300/50 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-dark-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <div className={`bg-gradient-to-r ${planColor}/10 border-2 border-current/20 rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${planColor} shadow-lg`}>
              {user?.user_metadata?.is_developer ? (
                <Award className="w-6 h-6 text-white" />
              ) : (
                <Crown className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-900">
                {planName} Plan
                {user?.user_metadata?.is_developer && (
                  <span className="ml-2 text-sm bg-orange-500/20 text-orange-600 px-2 py-1 rounded-full">
                    Developer
                  </span>
                )}
              </h2>
              <p className="text-dark-600">
                {planLimits.generations.daily === -1 ? 'Unlimited usage' : 'Daily limits apply'}
              </p>
            </div>
          </div>
          
          {!user?.user_metadata?.is_developer && user?.user_metadata?.subscription_tier === 'free' && (
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Upgrade</span>
              </div>
            </button>
          )}
        </div>

        {/* Reset Timer */}
        <div className="flex items-center space-x-2 text-sm text-dark-600">
          <Clock className="w-4 h-4" />
          <span>Daily limits reset in: {timeUntilReset}</span>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-dark-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            <span>Usage Statistics</span>
          </h3>
          
          <button
            onClick={loadUsageData}
            className="p-2 rounded-xl hover:bg-dark-300/50 transition-colors"
            title="Refresh Usage Data"
          >
            <RefreshCw className="w-5 h-5 text-dark-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usageItems.map((item, index) => {
            const percentage = getUsagePercentage(item.used, item.limit);
            const isUnlimited = item.limit === -1;
            const isNearLimit = percentage >= 80 && !isUnlimited;

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark-900">{item.label}</h4>
                      <p className="text-sm text-dark-600">
                        {isUnlimited ? 'Unlimited' : `${item.used} / ${item.limit}`}
                      </p>
                    </div>
                  </div>
                  
                  {isNearLimit && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {!isUnlimited && (
                  <div className="space-y-2">
                    <div className="w-full bg-dark-300/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${getUsageColor(percentage)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-dark-500">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>{item.limit - item.used} remaining</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Insights */}
      <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
        <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
          <Target className="w-6 h-6 text-primary-500" />
          <span>Usage Insights</span>
        </h3>

        <div className="space-y-4">
          {/* Most Used Feature */}
          <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl">
            <div>
              <h4 className="font-semibold text-dark-900">Most Used Feature</h4>
              <p className="text-sm text-dark-600">AI Generations ({usageData.generations} times today)</p>
            </div>
            <Flame className="w-6 h-6 text-orange-500" />
          </div>

          {/* Efficiency Score */}
          <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl">
            <div>
              <h4 className="font-semibold text-dark-900">Efficiency Score</h4>
              <p className="text-sm text-dark-600">
                {usageData.projects > 0 ? 
                  `${Math.round((usageData.generations / usageData.projects) * 10) / 10} generations per project` :
                  'No projects created yet'
                }
              </p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {usageData.projects > 0 ? 'A+' : '-'}
            </div>
          </div>

          {/* Recommendations */}
          {!user?.user_metadata?.is_developer && (
            <div className="p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30 rounded-xl">
              <h4 className="font-semibold text-primary-600 mb-2">💡 Recommendation</h4>
              <p className="text-sm text-dark-700">
                {user?.user_metadata?.subscription_tier === 'free' ? 
                  'Upgrade to Innovator plan for 10x more generations and unlimited projects!' :
                  'You\'re making great use of your plan! Consider upgrading for even more features.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};