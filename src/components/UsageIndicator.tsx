import React, { useState } from 'react';
import { Crown, Zap, FolderOpen, Download, ChevronDown, ChevronUp, BarChart3, TrendingUp } from 'lucide-react';
import { checkFeatureAccess } from '../utils/helpers';

interface UsageIndicatorProps {
  user: any;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  user,
  isPremium,
  onUpgradeClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const generationAccess = checkFeatureAccess('generation', isPremium, user?.id);
  const projectAccess = checkFeatureAccess('project', isPremium, user?.id);
  const exportAccess = checkFeatureAccess('export', isPremium, user?.id);

  const getUsageColor = (used: number, limit: number) => {
    if (limit === -1) return 'text-green-400'; // Unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressWidth = (used: number, limit: number) => {
    if (limit === -1) return '100%'; // Unlimited
    return `${Math.min((used / limit) * 100, 100)}%`;
  };

  const getProgressColor = (used: number, limit: number) => {
    if (limit === -1) return 'from-green-500 to-emerald-600'; // Unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-blue-600';
  };

  if (!user) return null;

  return (
    <div className="bg-dark-200/40 backdrop-blur-xl rounded-3xl border-2 border-dark-300/30 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isPremium ? (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-dark-900">
                {isPremium ? 'Premium Account' : 'Free Account'}
              </h3>
              <p className="text-sm text-dark-600">
                {isPremium ? 'Unlimited creative power' : 'Limited daily usage'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-dark-300/50 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-dark-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-dark-600" />
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getUsageColor(generationAccess.used || 0, generationAccess.limit || 0)}`}>
              {generationAccess.limit === -1 ? '∞' : `${generationAccess.used}/${generationAccess.limit}`}
            </div>
            <div className="text-xs text-dark-600 font-medium">Generations</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getUsageColor(projectAccess.used || 0, projectAccess.limit || 0)}`}>
              {projectAccess.limit === -1 ? '∞' : `${projectAccess.used}/${projectAccess.limit}`}
            </div>
            <div className="text-xs text-dark-600 font-medium">Projects</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getUsageColor(exportAccess.used || 0, exportAccess.limit || 0)}`}>
              {exportAccess.limit === -1 ? '∞' : `${exportAccess.used}/${exportAccess.limit}`}
            </div>
            <div className="text-xs text-dark-600 font-medium">Exports</div>
          </div>
        </div>

        {!isPremium && (
          <button
            onClick={onUpgradeClick}
            className="w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </div>
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-dark-300/30 pt-6">
          <div className="space-y-6">
            {/* Detailed Usage */}
            <div>
              <h4 className="font-bold text-dark-800 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Usage Details</span>
              </h4>
              
              <div className="space-y-4">
                {/* Generations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-700 flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>AI Generations</span>
                    </span>
                    <span className={`text-sm font-bold ${getUsageColor(generationAccess.used || 0, generationAccess.limit || 0)}`}>
                      {generationAccess.limit === -1 ? 'Unlimited' : `${generationAccess.used}/${generationAccess.limit}`}
                    </span>
                  </div>
                  {generationAccess.limit !== -1 && (
                    <div className="w-full bg-dark-300/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${getProgressColor(generationAccess.used || 0, generationAccess.limit || 0)} h-3 rounded-full transition-all duration-500 shadow-sm`}
                        style={{ width: getProgressWidth(generationAccess.used || 0, generationAccess.limit || 0) }}
                      />
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-700 flex items-center space-x-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>Saved Projects</span>
                    </span>
                    <span className={`text-sm font-bold ${getUsageColor(projectAccess.used || 0, projectAccess.limit || 0)}`}>
                      {projectAccess.limit === -1 ? 'Unlimited' : `${projectAccess.used}/${projectAccess.limit}`}
                    </span>
                  </div>
                  {projectAccess.limit !== -1 && (
                    <div className="w-full bg-dark-300/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${getProgressColor(projectAccess.used || 0, projectAccess.limit || 0)} h-3 rounded-full transition-all duration-500 shadow-sm`}
                        style={{ width: getProgressWidth(projectAccess.used || 0, projectAccess.limit || 0) }}
                      />
                    </div>
                  )}
                </div>

                {/* Exports */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-700 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Daily Exports</span>
                    </span>
                    <span className={`text-sm font-bold ${getUsageColor(exportAccess.used || 0, exportAccess.limit || 0)}`}>
                      {exportAccess.limit === -1 ? 'Unlimited' : `${exportAccess.used}/${exportAccess.limit}`}
                    </span>
                  </div>
                  {exportAccess.limit !== -1 && (
                    <div className="w-full bg-dark-300/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${getProgressColor(exportAccess.used || 0, exportAccess.limit || 0)} h-3 rounded-full transition-all duration-500 shadow-sm`}
                        style={{ width: getProgressWidth(exportAccess.used || 0, exportAccess.limit || 0) }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Benefits */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-2 border-primary-500/30 rounded-2xl p-4">
                <h5 className="font-bold text-primary-600 mb-3 flex items-center space-x-2">
                  <Crown className="w-4 h-4" />
                  <span>Premium Benefits</span>
                </h5>
                <ul className="text-sm text-dark-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Unlimited AI generations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Unlimited project saves</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Unlimited daily exports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Advanced color palettes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Reset Info */}
            <div className="text-center">
              <p className="text-xs text-dark-500">
                Daily limits reset at midnight UTC
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};