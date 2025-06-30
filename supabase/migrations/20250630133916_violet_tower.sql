/*
  # Fix audit logs RLS policy for client-side authentication logging

  1. Security
    - Add policy to allow authenticated users to insert their own audit logs
    - This enables client-side authentication event logging
    - Users can only insert logs for their own user_id

  Note: In production, consider moving audit logging to server-side edge functions
  for enhanced security, but this allows the current client-side implementation to work.
*/

-- Allow authenticated users to insert their own audit logs
CREATE POLICY "Users can insert their own audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);