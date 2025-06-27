import React from 'react';
import { Crown, Zap, FolderOpen, Download } from 'lucide-react';
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

  if (!user) return null;

  return (
    <div className="bg-dark-200/30 rounded-2xl p-4 border border-dark-300/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-dark-900 flex items-center space-x-2">
          {isPremium ? (
            <>
              <Crown className="w-5 h-5 text-yellow-500" />
              <span>Premium Account</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-primary-500" />
              <span>Free Account</span>
            </>
          )}
        </h3>
        {!isPremium && (
          <button
            onClick={onUpgradeClick}
            className="text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            Upgrade
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Generations */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-dark-700 flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>AI Generations</span>
            </span>
            <span className={`text-sm font-medium ${getUsageColor(generationAccess.used || 0, generationAccess.limit || 0)}`}>
              {generationAccess.limit === -1 ? 'Unlimited' : `${generationAccess.used}/${generationAccess.limit}`}
            </span>
          </div>
          {generationAccess.limit !== -1 && (
            <div className="w-full bg-dark-300/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth(generationAccess.used || 0, generationAccess.limit || 0) }}
              />
            </div>
          )}
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-dark-700 flex items-center space-x-1">
              <FolderOpen className="w-4 h-4" />
              <span>Saved Projects</span>
            </span>
            <span className={`text-sm font-medium ${getUsageColor(projectAccess.used || 0, projectAccess.limit || 0)}`}>
              {projectAccess.limit === -1 ? 'Unlimited' : `${projectAccess.used}/${projectAccess.limit}`}
            </span>
          </div>
          {projectAccess.limit !== -1 && (
            <div className="w-full bg-dark-300/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth(projectAccess.used || 0, projectAccess.limit || 0) }}
              />
            </div>
          )}
        </div>

        {/* Exports */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-dark-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Daily Exports</span>
            </span>
            <span className={`text-sm font-medium ${getUsageColor(exportAccess.used || 0, exportAccess.limit || 0)}`}>
              {exportAccess.limit === -1 ? 'Unlimited' : `${exportAccess.used}/${exportAccess.limit}`}
            </span>
          </div>
          {exportAccess.limit !== -1 && (
            <div className="w-full bg-dark-300/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth(exportAccess.used || 0, exportAccess.limit || 0) }}
              />
            </div>
          )}
        </div>
      </div>

      {!isPremium && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30">
          <p className="text-sm text-primary-600 font-medium">
            Upgrade to Premium for unlimited access to all features!
          </p>
        </div>
      )}
    </div>
  );
};