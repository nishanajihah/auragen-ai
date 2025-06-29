/*
  # Create webhook events tracking table

  1. New Tables
    - `webhook_events`
      - `id` (uuid, primary key)
      - `event_id` (text, unique) - RevenueCat event ID
      - `event_type` (text) - Type of webhook event
      - `app_user_id` (text) - RevenueCat app user ID
      - `payload` (jsonb) - Full webhook payload
      - `processed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `webhook_events` table
    - Add policy for service role access only

  3. Indexes
    - Index on event_id for fast duplicate checking
    - Index on app_user_id for user lookups
    - Index on event_type for analytics
*/

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  app_user_id text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only (webhooks are processed server-side)
CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_app_user_id ON webhook_events(app_user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at);