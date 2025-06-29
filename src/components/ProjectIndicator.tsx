import React from 'react';
import { FolderOpen, Palette } from 'lucide-react';

interface ProjectIndicatorProps {
  projectName: string;
  vibeSummary?: string;
  onOpenProjectManager?: () => void;
  className?: string;
}

export const ProjectIndicator: React.FC<ProjectIndicatorProps> = ({
  projectName,
  vibeSummary,
  onOpenProjectManager,
  className = ''
}) => {
  return (
    <div className={`bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg flex-shrink-0">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-dark-900 truncate">{projectName}</h3>
            {vibeSummary && (
              <p className="text-sm text-dark-600 truncate">{vibeSummary}</p>
            )}
          </div>
        </div>
        
        {onOpenProjectManager && (
          <button
            onClick={onOpenProjectManager}
            className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors flex-shrink-0"
            title="Manage Projects"
          >
            <FolderOpen className="w-5 h-5 text-dark-600" />
          </button>
        )}
      </div>
    </div>
  );
};