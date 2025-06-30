/*
  # Audit Logs Table for Security Monitoring

  1. New Tables
    - `audit_logs` - For tracking authentication and security events
  
  2. Features
    - Track all security-related events
    - Store IP addresses for security analysis
    - Maintain detailed event information
    - Enable user access to their own logs

  3. Security
    - Enable RLS on audit_logs table
    - Add appropriate policies
    - Create indexes for efficient querying
*/

-- Create audit_logs table if it doesn't exist already
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

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Create index on event_type for analytics
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_event_type text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    event_type,
    details,
    ip_address,
    created_at
  ) VALUES (
    p_user_id,
    p_event_type,
    p_details,
    p_ip_address,
    now()
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log password changes
CREATE OR REPLACE FUNCTION log_password_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_auth_event(
    NEW.id,
    'password_changed',
    jsonb_build_object('changed_at', now())
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password changes
DROP TRIGGER IF EXISTS log_password_change_trigger ON auth.users;
CREATE TRIGGER log_password_change_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.encrypted_password != OLD.encrypted_password)
EXECUTE FUNCTION log_password_change();

-- Create trigger to log email changes
CREATE OR REPLACE FUNCTION log_email_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_auth_event(
    NEW.id,
    'email_changed',
    jsonb_build_object(
      'old_email', OLD.email,
      'new_email', NEW.email,
      'changed_at', now()
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email changes
DROP TRIGGER IF EXISTS log_email_change_trigger ON auth.users;
CREATE TRIGGER log_email_change_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.email != OLD.email)
EXECUTE FUNCTION log_email_change();