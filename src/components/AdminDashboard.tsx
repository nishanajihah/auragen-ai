import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Database, Settings, BarChart3, 
  User, Crown, AlertTriangle, Check, X, RefreshCw,
  Search, Filter, Download, Clipboard, Eye, EyeOff,
  Lock, Unlock, Clock, Calendar, ArrowLeft
} from 'lucide-react';
import { analytics } from '../services/analytics';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
  account_status: string;
  plan_id: string;
  subscription_status: string;
  failed_login_attempts: number;
  mfa_enabled: boolean;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'security' | 'analytics'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserData>>({});

  // Fetch users (mock implementation)
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const mockUsers: UserData[] = [
      {
        id: '1',
        email: 'admin@example.com',
        created_at: '2025-01-01T00:00:00Z',
        last_login_at: '2025-06-15T10:30:00Z',
        account_status: 'active',
        plan_id: 'developer',
        subscription_status: 'premium',
        failed_login_attempts: 0,
        mfa_enabled: true
      },
      {
        id: '2',
        email: 'user1@example.com',
        created_at: '2025-02-15T00:00:00Z',
        last_login_at: '2025-06-14T08:45:00Z',
        account_status: 'active',
        plan_id: 'explorer',
        subscription_status: 'free',
        failed_login_attempts: 0,
        mfa_enabled: false
      },
      {
        id: '3',
        email: 'user2@example.com',
        created_at: '2025-03-10T00:00:00Z',
        last_login_at: null,
        account_status: 'locked',
        plan_id: 'explorer',
        subscription_status: 'free',
        failed_login_attempts: 5,
        mfa_enabled: false
      },
      {
        id: '4',
        email: 'premium@example.com',
        created_at: '2025-04-05T00:00:00Z',
        last_login_at: '2025-06-10T14:20:00Z',
        account_status: 'active',
        plan_id: 'team_pro',
        subscription_status: 'premium',
        failed_login_attempts: 0,
        mfa_enabled: true
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  // Filter users based on search and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle user actions
  const handleLockUser = (userId: string) => {
    // In a real implementation, this would call Supabase
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, account_status: 'locked' } 
        : user
    ));
    analytics.track('admin_locked_user', { userId });
  };

  const handleUnlockUser = (userId: string) => {
    // In a real implementation, this would call Supabase
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, account_status: 'active', failed_login_attempts: 0 } 
        : user
    ));
    analytics.track('admin_unlocked_user', { userId });
  };

  const handleSaveUserChanges = () => {
    if (!selectedUser || !editData) return;
    
    // In a real implementation, this would call Supabase
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...editData } 
        : user
    ));
    
    setSelectedUser(prev => prev ? { ...prev, ...editData } : null);
    setIsEditing(false);
    setEditData({});
    
    analytics.track('admin_updated_user', { userId: selectedUser.id });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs">Active</span>;
      case 'locked':
        return <span className="px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full text-xs">Locked</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full text-xs">Suspended</span>;
      case 'pending':
        return <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Pending</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-500 rounded-full text-xs">{status}</span>;
    }
  };

  const getPlanBadge = (planId: string) => {
    switch (planId) {
      case 'developer':
        return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full text-xs">Developer</span>;
      case 'team_pro':
      case 'pro':
        return <span className="px-2 py-0.5 bg-primary-500/20 text-primary-500 rounded-full text-xs">Pro</span>;
      case 'explorer':
      case 'free':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded-full text-xs">Free</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-500 rounded-full text-xs">{planId}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200">
      {/* Header */}
      <div className="bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-5 h-5 text-dark-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-dark-900">Admin Dashboard</h1>
                <p className="text-sm text-dark-600">Manage users and system settings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  // Refresh data
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                  analytics.track('admin_refreshed_data');
                }}
                className="p-2 rounded-lg hover:bg-dark-200/50 transition-colors border border-dark-300/30"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-dark-600" />
              </button>
              
              <button
                onClick={() => {
                  // Export data
                  analytics.track('admin_exported_data');
                }}
                className="p-2 rounded-lg hover:bg-dark-200/50 transition-colors border border-dark-300/30"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-dark-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('users');
                    analytics.track('admin_tab_changed', { tab: 'users' });
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-dark-700 hover:bg-dark-300/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">User Management</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('security');
                    analytics.track('admin_tab_changed', { tab: 'security' });
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-dark-700 hover:bg-dark-300/50'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Security Logs</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    analytics.track('admin_tab_changed', { tab: 'analytics' });
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-dark-700 hover:bg-dark-300/50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-dark-300/30">
                <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-dark-900">Admin Access</span>
                  </div>
                  <p className="text-xs text-dark-600">
                    You have full administrative access. All actions are logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by email..."
                        className="w-full pl-10 pr-4 py-2 bg-dark-100/80 border border-dark-300/50 rounded-lg text-dark-900 placeholder-dark-500 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-dark-500" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-dark-100/80 border border-dark-300/50 rounded-lg px-3 py-2 text-dark-900 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="locked">Locked</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User List */}
                <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 overflow-hidden">
                  <div className="p-6 border-b border-dark-300/30">
                    <h2 className="text-xl font-bold text-dark-900">User Management</h2>
                    <p className="text-dark-600">Manage user accounts and permissions</p>
                  </div>
                  
                  {loading ? (
                    <div className="p-6 text-center">
                      <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
                      <p className="text-dark-600">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-6 text-center">
                      <Users className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                      <p className="text-dark-600">No users found matching your criteria</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-300/30">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700">Last Login</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-dark-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-300/30">
                          {filteredUsers.map(user => (
                            <tr 
                              key={user.id} 
                              className="hover:bg-dark-300/20 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditData({});
                                setIsEditing(false);
                                analytics.track('admin_selected_user', { userId: user.id });
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {user.plan_id === 'developer' ? (
                                    <Crown className="w-4 h-4 text-orange-500" />
                                  ) : user.subscription_status === 'premium' ? (
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <User className="w-4 h-4 text-primary-500" />
                                  )}
                                  <span className="text-dark-900">{user.email}</span>
                                  {user.mfa_enabled && (
                                    <Shield className="w-3 h-3 text-green-500" title="MFA Enabled" />
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(user.account_status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getPlanBadge(user.plan_id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-dark-600 text-sm">
                                {formatDate(user.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-dark-600 text-sm">
                                {formatDate(user.last_login_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (user.account_status === 'active') {
                                        handleLockUser(user.id);
                                      } else if (user.account_status === 'locked') {
                                        handleUnlockUser(user.id);
                                      }
                                    }}
                                    className={`p-1 rounded-lg transition-colors ${
                                      user.account_status === 'active'
                                        ? 'hover:bg-red-500/20 text-red-500'
                                        : 'hover:bg-green-500/20 text-green-500'
                                    }`}
                                    title={user.account_status === 'active' ? 'Lock Account' : 'Unlock Account'}
                                  >
                                    {user.account_status === 'active' ? (
                                      <Lock className="w-4 h-4" />
                                    ) : (
                                      <Unlock className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedUser(user);
                                      setEditData({});
                                      setIsEditing(true);
                                      analytics.track('admin_edit_user_clicked', { userId: user.id });
                                    }}
                                    className="p-1 rounded-lg hover:bg-primary-500/20 text-primary-500 transition-colors"
                                    title="Edit User"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* User Details Modal */}
                {selectedUser && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-100/95 backdrop-blur-2xl rounded-2xl border-2 border-dark-200/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6 border-b border-dark-200/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {selectedUser.plan_id === 'developer' ? (
                              <Crown className="w-6 h-6 text-orange-500" />
                            ) : selectedUser.subscription_status === 'premium' ? (
                              <Crown className="w-6 h-6 text-yellow-500" />
                            ) : (
                              <User className="w-6 h-6 text-primary-500" />
                            )}
                            <div>
                              <h2 className="text-xl font-bold text-dark-900">
                                {isEditing ? 'Edit User' : 'User Details'}
                              </h2>
                              <p className="text-dark-600">{selectedUser.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(null);
                              setIsEditing(false);
                              setEditData({});
                            }}
                            className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
                          >
                            <X className="w-5 h-5 text-dark-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-dark-800 mb-2">Account Status</label>
                              <select
                                value={editData.account_status || selectedUser.account_status}
                                onChange={(e) => setEditData({ ...editData, account_status: e.target.value })}
                                className="w-full bg-dark-200/50 border border-dark-300/50 rounded-lg px-4 py-2 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                              >
                                <option value="active">Active</option>
                                <option value="locked">Locked</option>
                                <option value="suspended">Suspended</option>
                                <option value="pending">Pending</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-dark-800 mb-2">Plan</label>
                              <select
                                value={editData.plan_id || selectedUser.plan_id}
                                onChange={(e) => setEditData({ ...editData, plan_id: e.target.value })}
                                className="w-full bg-dark-200/50 border border-dark-300/50 rounded-lg px-4 py-2 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                              >
                                <option value="explorer">Explorer (Free)</option>
                                <option value="solo_creator">Solo Creator</option>
                                <option value="team_pro">Team Pro</option>
                                <option value="developer">Developer</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-dark-800 mb-2">Subscription Status</label>
                              <select
                                value={editData.subscription_status || selectedUser.subscription_status}
                                onChange={(e) => setEditData({ ...editData, subscription_status: e.target.value })}
                                className="w-full bg-dark-200/50 border border-dark-300/50 rounded-lg px-4 py-2 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                              >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="past_due">Past Due</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-dark-800 mb-2">MFA Enabled</label>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => setEditData({ ...editData, mfa_enabled: true })}
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    (editData.mfa_enabled === true || (editData.mfa_enabled === undefined && selectedUser.mfa_enabled))
                                      ? 'bg-green-500 text-white'
                                      : 'bg-dark-200/50 text-dark-700'
                                  }`}
                                >
                                  Enabled
                                </button>
                                <button
                                  onClick={() => setEditData({ ...editData, mfa_enabled: false })}
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    (editData.mfa_enabled === false || (editData.mfa_enabled === undefined && !selectedUser.mfa_enabled))
                                      ? 'bg-red-500 text-white'
                                      : 'bg-dark-200/50 text-dark-700'
                                  }`}
                                >
                                  Disabled
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-dark-800 mb-2">Failed Login Attempts</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={editData.failed_login_attempts !== undefined ? editData.failed_login_attempts : selectedUser.failed_login_attempts}
                                onChange={(e) => setEditData({ ...editData, failed_login_attempts: parseInt(e.target.value) })}
                                className="w-full bg-dark-200/50 border border-dark-300/50 rounded-lg px-4 py-2 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                              />
                            </div>
                            
                            <div className="flex space-x-3 pt-4">
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditData({});
                                }}
                                className="flex-1 bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 px-4 py-2 rounded-lg transition-all border border-dark-300/30"
                              >
                                Cancel
                              </button>
                              
                              <button
                                onClick={handleSaveUserChanges}
                                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all shadow-lg"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">User ID</h3>
                                <div className="flex items-center space-x-2">
                                  <p className="text-dark-900 font-mono text-sm bg-dark-200/30 px-2 py-1 rounded">{selectedUser.id}</p>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedUser.id);
                                      analytics.track('admin_copied_user_id');
                                    }}
                                    className="p-1 rounded-lg hover:bg-dark-300/50 transition-colors"
                                    title="Copy ID"
                                  >
                                    <Clipboard className="w-4 h-4 text-dark-500" />
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Account Status</h3>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(selectedUser.account_status)}
                                  {selectedUser.account_status === 'locked' && (
                                    <button
                                      onClick={() => handleUnlockUser(selectedUser.id)}
                                      className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors"
                                    >
                                      Unlock
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Plan</h3>
                                <div>{getPlanBadge(selectedUser.plan_id)}</div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Subscription Status</h3>
                                <div>
                                  {selectedUser.subscription_status === 'premium' ? (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs">Premium</span>
                                  ) : selectedUser.subscription_status === 'past_due' ? (
                                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full text-xs">Past Due</span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded-full text-xs">Free</span>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Created At</h3>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-dark-500" />
                                  <p className="text-dark-900">{formatDate(selectedUser.created_at)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Last Login</h3>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-dark-500" />
                                  <p className="text-dark-900">{formatDate(selectedUser.last_login_at)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">Failed Login Attempts</h3>
                                <p className="text-dark-900">{selectedUser.failed_login_attempts}</p>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-dark-700 mb-1">MFA Status</h3>
                                <div>
                                  {selectedUser.mfa_enabled ? (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs flex items-center space-x-1">
                                      <Shield className="w-3 h-3" />
                                      <span>Enabled</span>
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full text-xs">Disabled</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3 pt-4">
                              <button
                                onClick={() => {
                                  setIsEditing(true);
                                  analytics.track('admin_edit_user_clicked', { userId: selectedUser.id });
                                }}
                                className="flex-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 px-4 py-2 rounded-lg transition-all border border-primary-500/30"
                              >
                                Edit User
                              </button>
                              
                              {selectedUser.account_status === 'active' ? (
                                <button
                                  onClick={() => {
                                    handleLockUser(selectedUser.id);
                                    setSelectedUser({ ...selectedUser, account_status: 'locked' });
                                  }}
                                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-lg transition-all border border-red-500/30"
                                >
                                  Lock Account
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleUnlockUser(selectedUser.id);
                                    setSelectedUser({ ...selectedUser, account_status: 'active', failed_login_attempts: 0 });
                                  }}
                                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 px-4 py-2 rounded-lg transition-all border border-green-500/30"
                                >
                                  Unlock Account
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
                  <h2 className="text-xl font-bold text-dark-900 mb-4">Security Audit Logs</h2>
                  
                  <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 mb-6">
                    <p className="text-dark-600">
                      This section displays security-related events such as login attempts, password changes, and account lockouts.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Mock security logs */}
                    {[
                      { id: '1', event: 'account_locked', user: 'user2@example.com', timestamp: '2025-06-15T08:30:00Z', details: 'Too many failed login attempts (5)' },
                      { id: '2', event: 'failed_login', user: 'user2@example.com', timestamp: '2025-06-15T08:29:00Z', details: 'Invalid password' },
                      { id: '3', event: 'password_changed', user: 'admin@example.com', timestamp: '2025-06-14T14:20:00Z', details: 'Password updated successfully' },
                      { id: '4', event: 'mfa_enabled', user: 'premium@example.com', timestamp: '2025-06-10T14:25:00Z', details: 'Two-factor authentication enabled' }
                    ].map(log => (
                      <div key={log.id} className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              {log.event === 'account_locked' && <Lock className="w-4 h-4 text-red-500" />}
                              {log.event === 'failed_login' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                              {log.event === 'password_changed' && <Key className="w-4 h-4 text-blue-500" />}
                              {log.event === 'mfa_enabled' && <Shield className="w-4 h-4 text-green-500" />}
                              <h3 className="font-semibold text-dark-900">{log.event.replace('_', ' ')}</h3>
                            </div>
                            <p className="text-dark-600 text-sm">{log.details}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-dark-600 text-sm">{formatDate(log.timestamp)}</p>
                            <p className="text-dark-500 text-xs">{log.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
                  <h2 className="text-xl font-bold text-dark-900 mb-4">Usage Analytics</h2>
                  
                  <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 mb-6">
                    <p className="text-dark-600">
                      This section provides insights into system usage, user activity, and subscription metrics.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 text-center">
                      <h3 className="text-sm font-semibold text-dark-700 mb-2">Total Users</h3>
                      <p className="text-3xl font-bold text-primary-600">4</p>
                    </div>
                    
                    <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 text-center">
                      <h3 className="text-sm font-semibold text-dark-700 mb-2">Premium Users</h3>
                      <p className="text-3xl font-bold text-yellow-500">2</p>
                    </div>
                    
                    <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 text-center">
                      <h3 className="text-sm font-semibold text-dark-700 mb-2">Active Today</h3>
                      <p className="text-3xl font-bold text-green-500">3</p>
                    </div>
                  </div>
                  
                  <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30">
                    <h3 className="font-semibold text-dark-900 mb-4">System Status</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-dark-700">Database</span>
                          <span className="text-green-500">Healthy</span>
                        </div>
                        <div className="w-full bg-dark-300/50 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-dark-700">API</span>
                          <span className="text-green-500">Operational</span>
                        </div>
                        <div className="w-full bg-dark-300/50 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-dark-700">Storage</span>
                          <span className="text-yellow-500">75% Used</span>
                        </div>
                        <div className="w-full bg-dark-300/50 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};