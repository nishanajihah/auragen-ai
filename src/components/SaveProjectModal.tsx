import React, { useState } from 'react';
import { X, Save, Tag, FileText, Calendar } from 'lucide-react';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: {
    name: string;
    description: string;
    tags: string[];
  }) => void;
  currentProject?: string;
  isLoading?: boolean;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProject = '',
  isLoading = false
}) => {
  const [name, setName] = useState(currentProject);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        tags
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Save className="w-6 h-6 text-dark-50" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-900">Save Project</h2>
              <p className="text-dark-600">Save your moodboard and design system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
          >
            <X className="w-6 h-6 text-dark-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-dark-800 mb-3">
              <FileText className="w-4 h-4" />
              <span>Project Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="input-field w-full focus-ring"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-dark-800 mb-3">
              <FileText className="w-4 h-4" />
              <span>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              className="input-field w-full resize-none focus-ring"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-dark-800 mb-3">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags..."
                className="input-field flex-1 focus-ring"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary px-4"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Save Info */}
          <div className="bg-dark-200/30 rounded-2xl p-4 border border-dark-300/30">
            <div className="flex items-center space-x-2 text-dark-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Save Information</span>
            </div>
            <p className="text-sm text-dark-600">
              Your project will be saved locally in your browser. You can load it anytime from the header menu.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-dark-50/30 border-t-dark-50 rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};