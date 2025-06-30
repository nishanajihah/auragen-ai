/*
  # Fix Audit Logs Policies and Functions

  1. New Policies
    - Create policy for users to insert their own audit logs
    - Create policy for users to view their own audit logs
    - Create policy for service role to manage all audit logs

  2. Indexes
    - Add indexes for user_id, event_type, and created_at for better query performance

  3. Functions
    - Create functions for logging auth events, password changes, and email changes
    - Add triggers for password and email changes
*/

-- Create policy for users to insert their own audit logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'Users can insert their own audit logs'
  ) THEN
    CREATE POLICY "Users can insert their own audit logs"
      ON audit_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policy for users to view their own audit logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'Users can view their own audit logs'
  ) THEN
    CREATE POLICY "Users can view their own audit logs"
      ON audit_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policy for service role to manage audit logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'Service role can manage audit logs'
  ) THEN
    CREATE POLICY "Service role can manage audit logs"
      ON audit_logs
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create function to log authentication events if it doesn't exist
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the calling function
    RAISE WARNING 'Failed to log auth event: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log password changes if it doesn't exist
CREATE OR REPLACE FUNCTION log_password_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_auth_event(
    NEW.id,
    'password_changed',
    jsonb_build_object('changed_at', now())
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the update
    RAISE WARNING 'Failed to log password change: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log email changes if it doesn't exist
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the update
    RAISE WARNING 'Failed to log email change: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password changes (safely drop if exists and recreate)
DROP TRIGGER IF EXISTS log_password_change_trigger ON auth.users;
CREATE TRIGGER log_password_change_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.encrypted_password != OLD.encrypted_password)
EXECUTE FUNCTION log_password_change();

-- Create trigger for email changes (safely drop if exists and recreate)
DROP TRIGGER IF EXISTS log_email_change_trigger ON auth.users;
CREATE TRIGGER log_email_change_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.email != OLD.email)
EXECUTE FUNCTION log_email_change();