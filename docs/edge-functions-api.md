# Supabase Edge Functions API Documentation

## Overview

This document provides comprehensive API documentation for the three Supabase Edge Functions that handle AI conversation, text-to-speech, and RevenueCat webhook processing.

## 1. AI Conversation Function

### Endpoint
```
POST https://your-project.supabase.co/functions/v1/ai-conversation
```

### Authentication
Requires a valid Supabase JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Request Body
```typescript
interface ConversationRequest {
  message: string                    // Required: User input text
  conversationHistory?: Array<{      // Optional: Previous conversation context
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  regenerateSection?: string         // Optional: Section to regenerate
  currentMoodboard?: any            // Optional: Current moodboard data
}
```

### Response
```typescript
interface ConversationResponse {
  message: string                    // AI response message
  moodboard?: {                     // Generated design system
    vibeSummary: string
    colorPalettes: Array<{
      name: string
      purpose: string
      colors: Array<{
        name: string
        hex: string
        rgb: string
        hsl: string
        description: string
        usage: string
      }>
    }>
    fontPairing: {
      heading: FontConfig
      body: FontConfig
    }
    visualInspiration: Array<InspirationItem>
    componentSuggestions: Array<ComponentSuggestion>
    designPrinciples: DesignPrinciples
  }
  isComplete: boolean               // Whether response is complete
  usage: {
    charactersUsed: number
    generationsRemaining: number    // -1 for unlimited
    resetTime: string              // ISO timestamp
  }
}
```

### Example Request
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai-conversation \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a modern SaaS design system with blue and white colors",
    "conversationHistory": []
  }'
```

### Error Responses
- `401 Unauthorized`: Invalid or missing JWT token
- `400 Bad Request`: Invalid request body or missing message
- `404 User Not Found`: User not found in database
- `429 Limit Exceeded`: Generation limit reached
- `503 Service Unavailable`: AI service temporarily unavailable

## 2. Text-to-Speech Function

### Endpoint
```
POST https://your-project.supabase.co/functions/v1/text-to-speech
```

### Authentication
Requires a valid Supabase JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Request Body
```typescript
interface TTSRequest {
  text: string                      // Required: Text to convert (max 5000 chars)
  voiceId?: string                 // Optional: ElevenLabs voice ID
  voiceSettings?: {                // Optional: Voice customization
    stability?: number             // 0.0 - 1.0
    similarity_boost?: number      // 0.0 - 1.0
    style?: number                // 0.0 - 1.0
    use_speaker_boost?: boolean
  }
}
```

### Response
```typescript
interface TTSResponse {
  audioUrl: string                 // Base64 encoded audio data URL
  usage: {
    charactersUsed: number
    charactersRemaining: number   // -1 for unlimited
    resetTime: string            // ISO timestamp
  }
  voiceInfo: {
    voiceId: string
    voiceName: string
  }
}
```

### Available Voices
- `pNInz6obpgDQGcFmaJgB`: Rachel (default)
- `EXAVITQu4vr4xnSDxMaL`: Bella
- `ErXwobaYiN019PkySvjV`: Antoni
- `MF3mGyEYCl7XYWbV9V6O`: Elli
- `TxGEqnHWrfWFTfGW9XjX`: Josh

### Character Limits by Plan
- Free: 1,000 characters/day
- Starter: 5,000 characters/day
- Pro: 20,000 characters/day
- Premium: Unlimited

### Example Request
```bash
curl -X POST https://your-project.supabase.co/functions/v1/text-to-speech \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the text-to-speech functionality.",
    "voiceId": "pNInz6obpgDQGcFmaJgB",
    "voiceSettings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }'
```

### Error Responses
- `401 Unauthorized`: Invalid or missing JWT token
- `400 Bad Request`: Invalid request body or text too long
- `404 User Not Found`: User not found in database
- `429 Character Limit Exceeded`: Daily character limit reached
- `503 Service Unavailable`: TTS service temporarily unavailable

## 3. RevenueCat Webhook Handler

### Endpoint
```
POST https://your-project.supabase.co/functions/v1/revenuecat-webhook
```

### Authentication
Uses HMAC-SHA256 signature verification with the webhook secret.

### Headers
```
Content-Type: application/json
X-RevenueCat-Signature: <hmac_signature>
```

### Webhook Events Processed
- `INITIAL_PURCHASE`: New subscription purchase
- `RENEWAL`: Subscription renewal
- `PRODUCT_CHANGE`: Plan upgrade/downgrade
- `CANCELLATION`: Subscription cancellation
- `EXPIRATION`: Subscription expiration
- `BILLING_ISSUE`: Payment failure
- `SUBSCRIBER_ALIAS`: User ID change

### Request Body (RevenueCat Format)
```typescript
interface RevenueCatEvent {
  api_version: string
  event: {
    id: string
    type: string
    event_timestamp_ms: number
    app_user_id: string
    product_id?: string
    period_type?: string
    purchased_at_ms?: number
    expiration_at_ms?: number
    transaction_id?: string
    price?: number
    currency?: string
    cancel_reason?: string
    // ... additional fields
  }
}
```

### Response
```typescript
interface WebhookResponse {
  success: boolean
  message: string
  eventId: string
  processed: boolean
}
```

### Plan Mapping
- `premium_monthly` / `premium_yearly` → `starter`
- `pro_monthly` / `pro_yearly` → `pro`
- `enterprise_monthly` / `enterprise_yearly` → `enterprise`

### Database Updates
The webhook handler updates the following user fields:
- `plan_id`: User's subscription plan
- `subscription_status`: Current status (free, premium, past_due)
- `generation_limit`: Daily generation limit based on plan
- `stripe_customer_id`: Transaction ID for reference

### Example Webhook Payload
```json
{
  "api_version": "1.0",
  "event": {
    "id": "event_12345",
    "type": "INITIAL_PURCHASE",
    "event_timestamp_ms": 1640995200000,
    "app_user_id": "user_abc123",
    "product_id": "premium_monthly",
    "purchased_at_ms": 1640995200000,
    "price": 9.99,
    "currency": "USD"
  }
}
```

## Database Schema

### Users Table Extensions
```sql
-- Additional columns for subscription management
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_id text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS generation_limit integer DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_generation_count integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id text;
```

### Usage Tracking Table
```sql
CREATE TABLE usage_tracking (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  generations integer DEFAULT 0,
  exports integer DEFAULT 0,
  projects_saved integer DEFAULT 0,
  voice_characters integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, date)
);
```

### Webhook Events Table
```sql
CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  app_user_id text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

### Subscription Metrics Table
```sql
CREATE TABLE subscription_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  event_type text NOT NULL,
  plan_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  revenue decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);
```

## Security Considerations

### JWT Token Validation
- All functions verify Supabase JWT tokens
- Tokens must be valid and not expired
- User must exist in the database

### API Key Protection
- Gemini and ElevenLabs API keys stored in Supabase Secrets
- Keys never exposed in responses or logs
- Environment variables used for secure access

### Webhook Security
- HMAC-SHA256 signature verification
- Webhook secret stored securely
- Idempotency checks prevent duplicate processing

### Rate Limiting
- Plan-based usage limits enforced
- Daily limits reset at midnight UTC
- Graceful degradation for limit exceeded scenarios

### Input Validation
- All inputs sanitized and validated
- Maximum text length limits enforced
- SQL injection prevention through parameterized queries

## Error Handling

### Common Error Patterns
```typescript
// Authentication Error
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}

// Rate Limit Error
{
  "error": "Limit Exceeded", 
  "message": "You've reached your daily limit of X generations",
  "usage": {
    "charactersUsed": 0,
    "generationsRemaining": 0,
    "resetTime": "2024-01-02T00:00:00.000Z"
  }
}

// Service Error
{
  "error": "Service Unavailable",
  "message": "AI service is temporarily unavailable"
}
```

### Retry Logic
- Implement exponential backoff for transient errors
- Maximum 3 retry attempts recommended
- Different retry strategies for different error types

## Monitoring and Analytics

### Metrics Tracked
- API request counts and response times
- Error rates by function and error type
- Usage patterns by plan type
- Revenue metrics from webhook events

### Logging
- All functions log important events
- Error details logged for debugging
- Webhook events stored for audit trail

### Health Checks
- Functions return appropriate HTTP status codes
- Database connectivity monitored
- External API availability tracked