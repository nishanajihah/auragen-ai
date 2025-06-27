import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, Plus, Save, Trash2, Edit, Calendar, Tag, 
  Search, Filter, Grid, List, X, FileText, Palette,
  Download, Upload, Star, Clock, User, Settings, Crown,
  ArrowLeft
} from 'lucide-react';
import { ProjectData, MoodboardData, Message } from '../types';
import { formatDate } from '../utils/helpers';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject?: string;
  currentMoodboard?: MoodboardData | null;
  currentMessages?: Message[];
  onSaveProject: (projectData: {
    name: string;
    description: string;
    tags: string[];
  }) => void;
  onLoadProject: (project: ProjectData) => void;
  onNewProject: () => void;
  onExport: () => void;
  user?: any;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  isOpen,
  onClose,
  currentProject,
  currentMoodboard,
  currentMessages = [],
  onSaveProject,
  onLoadProject,
  onNewProject,
  onExport,
  user
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'tags'>('date');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem('auragen-projects') || '[]');
    const userProjects = user 
      ? savedProjects.filter((p: ProjectData) => p.userId === user.id)
      : savedProjects;
    
    const projectsWithDates = userProjects.map((project: any) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    }));
    
    setProjects(projectsWithDates);
  };

  const deleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const allProjects = JSON.parse(localStorage.getItem('auragen-projects') || '[]');
      const updatedProjects = allProjects.filter((p: ProjectData) => p.id !== projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      localStorage.setItem('auragen-projects', JSON.stringify(updatedProjects));
    }
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) return;

    const projectData = {
      name: projectName.trim(),
      description: projectDescription.trim(),
      tags: projectTags
    };

    if (editingProject) {
      // Update existing project
      const updatedProject = {
        ...editingProject,
        ...projectData,
        updatedAt: new Date()
      };
      
      const allProjects = JSON.parse(localStorage.getItem('auragen-projects') || '[]');
      const updatedAllProjects = allProjects.map((p: ProjectData) => 
        p.id === editingProject.id ? updatedProject : p
      );
      
      localStorage.setItem('auragen-projects', JSON.stringify(updatedAllProjects));
      loadProjects();
      setEditingProject(null);
    } else {
      // Save new project
      onSaveProject(projectData);
      loadProjects();
    }

    setShowSaveModal(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectTags([]);
    setTagInput('');
  };

  const openSaveModal = (project?: ProjectData) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setProjectDescription(project.description);
      setProjectTags(project.tags || []);
    } else {
      setEditingProject(null);
      setProjectName(currentProject || '');
      setProjectDescription('');
      setProjectTags([]);
    }
    setShowSaveModal(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !projectTags.includes(tagInput.trim())) {
      setProjectTags([...projectTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectTags(projectTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || project.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tags':
          return (a.tags?.length || 0) - (b.tags?.length || 0);
        case 'date':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* WIDER PROJECT MANAGER - FULL SCREEN */}
      <div className="w-full max-w-7xl h-[90vh] bg-dark-100/95 backdrop-blur-2xl border-2 border-dark-200/40 shadow-2xl rounded-3xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-3 rounded-xl hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-6 h-6 text-dark-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <FolderOpen className="w-8 h-8 text-dark-50" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-dark-900">Project Manager</h2>
                  <p className="text-lg text-dark-600">{projects.length} saved projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => {
                onNewProject();
                onClose();
              }}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6" />
              <span>New Project</span>
            </button>
            
            {currentMoodboard && (
              <button
                onClick={() => openSaveModal()}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Save className="w-6 h-6" />
                <span>Save Current</span>
              </button>
            )}

            {currentMoodboard && (
              <button
                onClick={() => {
                  onExport();
                  onClose();
                }}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Download className="w-6 h-6" />
                <span>Export Design</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center justify-center space-x-3 bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-dark-300/50 hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl"
            >
              <X className="w-6 h-6" />
              <span>Close</span>
            </button>
          </div>

          {/* Search and Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-12 pr-4 py-3 bg-dark-200/50 border border-dark-300/50 rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
              />
            </div>

            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-dark-200/50 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-dark-200/50 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="tags">Sort by Tags</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-3 rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-dark-600 hover:bg-dark-200/50 border border-dark-300/30'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-3 rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-dark-600 hover:bg-dark-200/50 border border-dark-300/30'
                }`}
              >
                <List className="w-5 h-5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-24 h-24 text-dark-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-dark-900 mb-4">
                {searchTerm || selectedTag ? 'No projects match your filters' : 'No projects saved yet'}
              </h3>
              <p className="text-dark-600 mb-8">
                {searchTerm || selectedTag 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first design system to get started'
                }
              </p>
              {!searchTerm && !selectedTag && (
                <button
                  onClick={() => {
                    onNewProject();
                    onClose();
                  }}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-dark-200/30 rounded-2xl border border-dark-300/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl ${
                    viewMode === 'list' ? 'flex items-center p-6 space-x-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <div className="space-y-4">
                      {/* Project Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-dark-900 mb-2 line-clamp-2">{project.name}</h3>
                          <p className="text-dark-600 text-sm line-clamp-3 mb-3">{project.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-3">
                          <button
                            onClick={() => openSaveModal(project)}
                            className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4 text-dark-500" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Vibe Summary */}
                      <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Palette className="w-4 h-4 text-primary-500" />
                          <span className="text-sm font-semibold text-primary-600">Design Vibe</span>
                        </div>
                        <p className="text-sm text-dark-700 font-medium">{project.moodboard.vibeSummary}</p>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="badge badge-primary text-xs">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-xs text-dark-500 bg-dark-300/30 px-2 py-1 rounded-full">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-dark-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.updatedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Palette className="w-3 h-3" />
                          <span>{project.moodboard.colorPalettes.length} palette{project.moodboard.colorPalettes.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Load Button */}
                      <button
                        onClick={() => {
                          onLoadProject(project);
                          onClose();
                        }}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Load Project
                      </button>
                    </div>
                  ) : (
                    /* List View */
                    <>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-dark-900 mb-1">{project.name}</h3>
                        <p className="text-dark-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-dark-500 mb-2">
                          <span>{formatDate(project.updatedAt)}</span>
                          <span>{project.moodboard.vibeSummary}</span>
                          <span>{project.moodboard.colorPalettes.length} palette{project.moodboard.colorPalettes.length !== 1 ? 's' : ''}</span>
                        </div>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 5).map((tag) => (
                              <span key={tag} className="badge badge-primary text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            onLoadProject(project);
                            onClose();
                          }}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Load Project
                        </button>
                        <button
                          onClick={() => openSaveModal(project)}
                          className="p-3 rounded-xl hover:bg-dark-300/50 transition-colors border border-dark-300/30"
                        >
                          <Edit className="w-5 h-5 text-dark-500" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-3 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save/Edit Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-70 flex items-center justify-center p-4">
          <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl p-8 border-2 border-dark-200/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <Save className="w-6 h-6 text-dark-50" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-dark-900">
                    {editingProject ? 'Edit Project' : 'Save Project'}
                  </h2>
                  <p className="text-dark-600">
                    {editingProject ? 'Update project details' : 'Save your moodboard and design system'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  resetForm();
                  setEditingProject(null);
                }}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
              >
                <X className="w-6 h-6 text-dark-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-dark-800 mb-3">
                  <FileText className="w-4 h-4" />
                  <span>Project Name *</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="w-full bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl px-6 py-4 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
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
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl px-6 py-4 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 resize-none"
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
                    className="flex-1 bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl px-6 py-3 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-dark-300/50 hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl"
                  >
                    Add
                  </button>
                </div>
                {projectTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {projectTags.map((tag) => (
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

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false);
                    resetForm();
                    setEditingProject(null);
                  }}
                  className="flex-1 bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-dark-300/50 hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  disabled={!projectName.trim()}
                  className="flex-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-dark-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{editingProject ? 'Update Project' : 'Save Project'}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};