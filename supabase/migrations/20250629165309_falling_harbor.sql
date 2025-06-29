/*
  # Create subscription metrics tracking table

  1. New Tables
    - `subscription_metrics`
      - `id` (uuid, primary key)
      - `date` (date) - Date of the metric
      - `event_type` (text) - Type of subscription event
      - `plan_id` (text) - Subscription plan
      - `user_id` (uuid) - User who triggered the event
      - `revenue` (decimal) - Revenue amount
      - `currency` (text) - Currency code
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `subscription_metrics` table
    - Add policy for service role access only

  3. Indexes
    - Index on date for time-based queries
    - Index on event_type for analytics
    - Index on plan_id for plan-based analytics
*/

CREATE TABLE IF NOT EXISTS subscription_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  event_type text NOT NULL,
  plan_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  revenue decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only
CREATE POLICY "Service role can manage subscription metrics"
  ON subscription_metrics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_subscription_metrics_date ON subscription_metrics(date);
CREATE INDEX IF NOT EXISTS idx_subscription_metrics_event_type ON subscription_metrics(event_type);
CREATE INDEX IF NOT EXISTS idx_subscription_metrics_plan_id ON subscription_metrics(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscription_metrics_user_id ON subscription_metrics(user_id);