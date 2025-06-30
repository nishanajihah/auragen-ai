/*
  # Fix Database Error Granting User

  This migration addresses common causes of "Database error granting user" errors:

  1. RLS Policy Issues
     - Updates RLS policies to ensure proper user creation and access
     - Adds missing policies for user registration flow

  2. Database Constraints
     - Ensures all required columns have proper defaults
     - Fixes any constraint violations

  3. Trigger Function Issues
     - Updates trigger functions to handle edge cases
     - Ensures triggers don't fail during user creation
*/

-- First, let's ensure the update_updated_at_column function exists and is robust
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = COALESCE(NEW.updated_at, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure check_failed_login_attempts function is robust
CREATE OR REPLACE FUNCTION check_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check if failed_login_attempts is being increased
    IF NEW.failed_login_attempts > OLD.failed_login_attempts THEN
        -- Lock account if too many failed attempts
        IF NEW.failed_login_attempts >= 5 THEN
            NEW.account_status = 'locked';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update the users table to ensure all columns have proper defaults
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'plan_id'
    ) THEN
        ALTER TABLE users ADD COLUMN plan_id text DEFAULT 'explorer';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'generation_limit'
    ) THEN
        ALTER TABLE users ADD COLUMN generation_limit integer DEFAULT 90;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'current_generation_count'
    ) THEN
        ALTER TABLE users ADD COLUMN current_generation_count integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_status text DEFAULT 'free';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'account_status'
    ) THEN
        ALTER TABLE users ADD COLUMN account_status text DEFAULT 'active';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'failed_login_attempts'
    ) THEN
        ALTER TABLE users ADD COLUMN failed_login_attempts integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'mfa_enabled'
    ) THEN
        ALTER TABLE users ADD COLUMN mfa_enabled boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_history'
    ) THEN
        ALTER TABLE users ADD COLUMN password_history jsonb DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_login_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_login_at timestamptz;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE users ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'rc_anonymous_id'
    ) THEN
        ALTER TABLE users ADD COLUMN rc_anonymous_id text;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id text;
    END IF;
END $$;

-- Ensure proper defaults are set
ALTER TABLE users ALTER COLUMN plan_id SET DEFAULT 'explorer';
ALTER TABLE users ALTER COLUMN generation_limit SET DEFAULT 90;
ALTER TABLE users ALTER COLUMN current_generation_count SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN subscription_status SET DEFAULT 'free';
ALTER TABLE users ALTER COLUMN account_status SET DEFAULT 'active';
ALTER TABLE users ALTER COLUMN failed_login_attempts SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN mfa_enabled SET DEFAULT false;
ALTER TABLE users ALTER COLUMN password_history SET DEFAULT '[]'::jsonb;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now();

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Individuals can create their own user data." ON users;
DROP POLICY IF EXISTS "Individuals can view their own user data." ON users;
DROP POLICY IF EXISTS "Individuals can update their own user data." ON users;

-- Create comprehensive RLS policies
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to manage all user data (needed for auth operations)
CREATE POLICY "Service role can manage all user data"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure the foreign key constraint exists and is properly configured
DO $$
BEGIN
    -- Drop existing foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_id_fkey' AND table_name = 'users'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT users_id_fkey;
    END IF;
    
    -- Recreate the foreign key constraint
    ALTER TABLE users ADD CONSTRAINT users_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Ensure unique constraints exist
DO $$
BEGIN
    -- Email unique constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_email_key' AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;

    -- RC anonymous ID unique constraint (allow nulls)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_rc_anonymous_id_key' AND table_name = 'users'
    ) THEN
        CREATE UNIQUE INDEX users_rc_anonymous_id_key ON users (rc_anonymous_id) WHERE rc_anonymous_id IS NOT NULL;
    END IF;

    -- Stripe customer ID unique constraint (allow nulls)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_stripe_customer_id_key' AND table_name = 'users'
    ) THEN
        CREATE UNIQUE INDEX users_stripe_customer_id_key ON users (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
    END IF;
END $$;

-- Recreate triggers to ensure they work properly
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS check_failed_login_attempts_trigger ON users;
CREATE TRIGGER check_failed_login_attempts_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (NEW.failed_login_attempts > OLD.failed_login_attempts)
    EXECUTE FUNCTION check_failed_login_attempts();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users (account_status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users (subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users (last_login_at);

-- Ensure audit_logs table has proper RLS for user operations
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing audit_logs policies
DROP POLICY IF EXISTS "Service role can manage audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON audit_logs;

-- Recreate audit_logs policies
CREATE POLICY "Service role can manage audit logs"
  ON audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert their own audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE audit_logs TO authenticated;
GRANT ALL ON TABLE projects TO authenticated;
GRANT ALL ON TABLE usage_tracking TO authenticated;

-- Grant service role permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

CREATE POLICY "Users can view their own audit logs"