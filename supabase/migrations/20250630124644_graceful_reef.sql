/*
  # Authentication System Enhancements

  1. New Tables
    - `audit_logs` - For tracking authentication and security events
  
  2. Schema Updates
    - Add security-related columns to `users` table:
      - `account_status` - User account status (active, locked, suspended)
      - `failed_login_attempts` - Track failed login attempts
      - `last_login_at` - Last successful login timestamp
      - `mfa_enabled` - Whether MFA is enabled for the user
      - `password_history` - Store history of password changes

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
    - Create functions for security-related operations
*/

-- Create audit_logs table for security event tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage audit logs
CREATE POLICY "Service role can manage audit logs"
  ON audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for users to view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add security-related columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_history jsonb DEFAULT '[]'::jsonb;

-- Create index on account_status for faster queries
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);

-- Create function to automatically lock accounts after too many failed attempts
CREATE OR REPLACE FUNCTION check_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  -- If failed attempts reach threshold, lock the account
  IF NEW.failed_login_attempts >= 5 AND NEW.account_status = 'active' THEN
    NEW.account_status := 'locked';
    
    -- Insert audit log entry
    INSERT INTO audit_logs (
      user_id, 
      event_type, 
      details, 
      created_at
    ) VALUES (
      NEW.id, 
      'account_locked', 
      jsonb_build_object('reason', 'too_many_failed_attempts', 'attempts', NEW.failed_login_attempts),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to check failed login attempts
DROP TRIGGER IF EXISTS check_failed_login_attempts_trigger ON users;
CREATE TRIGGER check_failed_login_attempts_trigger
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (NEW.failed_login_attempts > OLD.failed_login_attempts)
EXECUTE FUNCTION check_failed_login_attempts();

-- Create function to track password history
CREATE OR REPLACE FUNCTION update_password_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Add current timestamp to password history
  NEW.password_history := jsonb_build_array(
    jsonb_build_object('changed_at', now())
  ) || COALESCE(OLD.password_history, '[]'::jsonb);
  
  -- Keep only the last 5 entries
  IF jsonb_array_length(NEW.password_history) > 5 THEN
    NEW.password_history := (
      SELECT jsonb_agg(value)
      FROM (
        SELECT value
        FROM jsonb_array_elements(NEW.password_history)
        LIMIT 5
      ) sub
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password history
DROP TRIGGER IF EXISTS update_password_history_trigger ON auth.users;
CREATE TRIGGER update_password_history_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.encrypted_password != OLD.encrypted_password)
EXECUTE FUNCTION update_password_history();

-- Create function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION reset_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset failed attempts and update last login time
  UPDATE users
  SET 
    failed_login_attempts = 0,
    last_login_at = now(),
    updated_at = now()
  WHERE id = NEW.id;
  
  -- Insert audit log entry
  INSERT INTO audit_logs (
    user_id, 
    event_type, 
    created_at
  ) VALUES (
    NEW.id, 
    'successful_login',
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for successful logins
DROP TRIGGER IF EXISTS reset_failed_login_attempts_trigger ON auth.users;
CREATE TRIGGER reset_failed_login_attempts_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.last_sign_in_at != OLD.last_sign_in_at)
EXECUTE FUNCTION reset_failed_login_attempts();