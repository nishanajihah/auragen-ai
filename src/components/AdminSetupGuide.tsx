import React, { useState } from 'react';
import { 
  Shield, Terminal, Database, Key, Copy, Check, 
  ChevronDown, ChevronUp, ExternalLink, Code, User,
  Crown, AlertTriangle, Info, Clipboard
} from 'lucide-react';

export const AdminSetupGuide: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Admin/Developer Account Setup</h2>
          <p className="text-dark-600">Configure privileged accounts with enhanced access</p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="border border-dark-300/30 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('overview')}
          className="w-full flex items-center justify-between p-4 bg-dark-100/50 text-left"
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary-500" />
            <span className="font-semibold text-dark-900">Overview</span>
          </div>
          {openSection === 'overview' ? (
            <ChevronUp className="w-5 h-5 text-dark-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-500" />
          )}
        </button>
        
        {openSection === 'overview' && (
          <div className="p-4 bg-dark-200/20">
            <p className="text-dark-700 mb-4">
              Admin/Developer accounts in AuraGen AI have special privileges and are exempt from usage limits and charges. 
              These accounts are configured directly in Supabase and require specific metadata settings.
            </p>
            
            <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 mb-4">
              <h4 className="font-semibold text-dark-800 mb-2 flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>Key Benefits</span>
              </h4>
              <ul className="space-y-1 text-dark-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Unlimited generations, exports, and projects</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Access to all premium features</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Exempt from all usage charges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Access to developer-only features and settings</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-dark-700">
                  Admin accounts should only be created for trusted team members who need full system access. 
                  All admin actions are logged for security purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supabase Configuration */}
      <div className="border border-dark-300/30 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('supabase')}
          className="w-full flex items-center justify-between p-4 bg-dark-100/50 text-left"
        >
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-dark-900">Supabase Configuration</span>
          </div>
          {openSection === 'supabase' ? (
            <ChevronUp className="w-5 h-5 text-dark-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-500" />
          )}
        </button>
        
        {openSection === 'supabase' && (
          <div className="p-4 bg-dark-200/20">
            <p className="text-dark-700 mb-4">
              Follow these steps to create an admin/developer account in your Supabase project:
            </p>
            
            <ol className="space-y-6">
              <li className="space-y-2">
                <h4 className="font-semibold text-dark-800">1. Create a new user in Supabase Authentication</h4>
                <p className="text-dark-600">
                  Navigate to Authentication → Users in your Supabase dashboard and create a new user with the email address you want to use for the admin account.
                </p>
                <div className="bg-dark-300/30 rounded-lg p-3 font-mono text-xs text-dark-700 overflow-x-auto">
                  <p>Email: developer@yourdomain.com</p>
                  <p>Password: [Strong password]</p>
                </div>
              </li>
              
              <li className="space-y-2">
                <h4 className="font-semibold text-dark-800">2. Update user metadata via SQL</h4>
                <p className="text-dark-600">
                  Run the following SQL query in the Supabase SQL Editor to update the user's metadata:
                </p>
                <div className="relative">
                  <div className="bg-dark-300/30 rounded-lg p-3 font-mono text-xs text-dark-700 overflow-x-auto">
                    <pre>{`UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{subscription_tier}',
  '"developer"'
)
WHERE email = 'developer@yourdomain.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{is_developer}',
  'true'
)
WHERE email = 'developer@yourdomain.com';`}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{subscription_tier}',
  '"developer"'
)
WHERE email = 'developer@yourdomain.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{is_developer}',
  'true'
)
WHERE email = 'developer@yourdomain.com';`, 'sql1')}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-dark-400/30 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === 'sql1' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-dark-500" />
                    )}
                  </button>
                </div>
              </li>
              
              <li className="space-y-2">
                <h4 className="font-semibold text-dark-800">3. Update users table in the database</h4>
                <p className="text-dark-600">
                  Run this SQL to update the users table with admin privileges:
                </p>
                <div className="relative">
                  <div className="bg-dark-300/30 rounded-lg p-3 font-mono text-xs text-dark-700 overflow-x-auto">
                    <pre>{`UPDATE public.users
SET 
  plan_id = 'developer',
  generation_limit = -1,
  subscription_status = 'premium',
  account_status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'developer@yourdomain.com'
);`}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`UPDATE public.users
SET 
  plan_id = 'developer',
  generation_limit = -1,
  subscription_status = 'premium',
  account_status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'developer@yourdomain.com'
);`, 'sql2')}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-dark-400/30 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === 'sql2' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-dark-500" />
                    )}
                  </button>
                </div>
              </li>
              
              <li className="space-y-2">
                <h4 className="font-semibold text-dark-800">4. Verify the configuration</h4>
                <p className="text-dark-600">
                  Run this SQL to verify the user has been properly configured:
                </p>
                <div className="relative">
                  <div className="bg-dark-300/30 rounded-lg p-3 font-mono text-xs text-dark-700 overflow-x-auto">
                    <pre>{`SELECT 
  au.email,
  au.raw_user_meta_data->>'subscription_tier' as auth_tier,
  au.raw_user_meta_data->>'is_developer' as is_developer,
  pu.plan_id,
  pu.generation_limit,
  pu.subscription_status,
  pu.account_status
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'developer@yourdomain.com';`}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`SELECT 
  au.email,
  au.raw_user_meta_data->>'subscription_tier' as auth_tier,
  au.raw_user_meta_data->>'is_developer' as is_developer,
  pu.plan_id,
  pu.generation_limit,
  pu.subscription_status,
  pu.account_status
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'developer@yourdomain.com';`, 'sql3')}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-dark-400/30 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === 'sql3' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-dark-500" />
                    )}
                  </button>
                </div>
              </li>
            </ol>
            
            <div className="mt-6 bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-dark-700 mb-2">
                    After completing these steps, sign in with the developer account to verify it has the correct privileges.
                    You should see a "Developer" badge in the profile menu and have unlimited access to all features.
                  </p>
                  <p className="text-dark-700">
                    <strong>Note:</strong> The special developer email <code>developer@auragen.ai</code> is automatically recognized by the system and granted developer privileges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Privileges */}
      <div className="border border-dark-300/30 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('privileges')}
          className="w-full flex items-center justify-between p-4 bg-dark-100/50 text-left"
        >
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-dark-900">Admin Privileges & Access Controls</span>
          </div>
          {openSection === 'privileges' ? (
            <ChevronUp className="w-5 h-5 text-dark-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-500" />
          )}
        </button>
        
        {openSection === 'privileges' && (
          <div className="p-4 bg-dark-200/20">
            <p className="text-dark-700 mb-4">
              Admin/Developer accounts have the following privileges and access controls:
            </p>
            
            <div className="space-y-4">
              <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30">
                <h4 className="font-semibold text-dark-800 mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary-500" />
                  <span>Account Privileges</span>
                </h4>
                <ul className="space-y-1 text-dark-600">
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited AI generations (no daily limit)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited project saves</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited exports in all formats</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to all premium features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exempt from all usage charges</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30">
                <h4 className="font-semibold text-dark-800 mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span>Access Controls</span>
                </h4>
                <ul className="space-y-1 text-dark-600">
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Developer badge displayed in UI</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to advanced settings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Ability to view detailed usage analytics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exempt from account lockouts</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-300/30">
                <h4 className="font-semibold text-dark-800 mb-2 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-primary-500" />
                  <span>Technical Access</span>
                </h4>
                <ul className="space-y-1 text-dark-600">
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to premium AI models (Gemini Pro)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited voice character usage</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to developer-only API endpoints</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-red-500/10 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-dark-700 font-semibold mb-1">Security Considerations</p>
                  <p className="text-dark-700">
                    Admin accounts have extensive privileges. Ensure you follow security best practices:
                  </p>
                  <ul className="mt-2 space-y-1 text-dark-600">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <span>Use strong, unique passwords</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <span>Enable two-factor authentication</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <span>Regularly audit admin account activity</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <span>Limit the number of admin accounts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Resources */}
      <div className="border border-dark-300/30 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('resources')}
          className="w-full flex items-center justify-between p-4 bg-dark-100/50 text-left"
        >
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-dark-900">Additional Resources</span>
          </div>
          {openSection === 'resources' ? (
            <ChevronUp className="w-5 h-5 text-dark-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-500" />
          )}
        </button>
        
        {openSection === 'resources' && (
          <div className="p-4 bg-dark-200/20">
            <div className="space-y-4">
              <a 
                href="https://supabase.com/docs/guides/auth/managing-user-data" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 hover:border-primary-500/30 transition-colors"
              >
                <h4 className="font-semibold text-dark-800 mb-1 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-500" />
                  <span>Supabase User Management</span>
                  <ExternalLink className="w-3 h-3 text-dark-500" />
                </h4>
                <p className="text-sm text-dark-600">
                  Learn how to manage user data and metadata in Supabase
                </p>
              </a>
              
              <a 
                href="https://supabase.com/docs/guides/auth/row-level-security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 hover:border-primary-500/30 transition-colors"
              >
                <h4 className="font-semibold text-dark-800 mb-1 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Row Level Security</span>
                  <ExternalLink className="w-3 h-3 text-dark-500" />
                </h4>
                <p className="text-sm text-dark-600">
                  Understanding Supabase's Row Level Security for access control
                </p>
              </a>
              
              <a 
                href="https://supabase.com/docs/guides/database/functions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-dark-100/50 rounded-lg p-4 border border-dark-300/30 hover:border-primary-500/30 transition-colors"
              >
                <h4 className="font-semibold text-dark-800 mb-1 flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-500" />
                  <span>Database Functions</span>
                  <ExternalLink className="w-3 h-3 text-dark-500" />
                </h4>
                <p className="text-sm text-dark-600">
                  Creating and managing PostgreSQL functions in Supabase
                </p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};