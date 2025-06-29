/*
  # RevenueCat Webhook Handler Edge Function

  1. Features
    - Secure webhook signature verification
    - Subscription event processing (purchase, renewal, cancellation)
    - User plan updates and synchronization
    - Idempotency checks to prevent duplicate processing
    - Comprehensive event logging and analytics

  2. Security
    - HMAC-SHA256 signature verification
    - Webhook secret validation
    - Event deduplication
    - Secure database operations

  3. Database Operations
    - User subscription status updates
    - Plan tier modifications
    - Usage limit adjustments
    - Event tracking and analytics
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-revenuecat-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RevenueCatEvent {
  api_version: string
  event: {
    id: string
    type: string
    event_timestamp_ms: number
    app_user_id: string
    aliases?: string[]
    original_app_user_id?: string
    product_id?: string
    period_type?: string
    purchased_at_ms?: number
    expiration_at_ms?: number
    environment?: string
    presented_offering_id?: string
    transaction_id?: string
    original_transaction_id?: string
    is_family_share?: boolean
    country_code?: string
    app_id?: string
    entitlement_id?: string
    entitlement_ids?: string[]
    store?: string
    subscriber_attributes?: Record<string, any>
    price?: number
    currency?: string
    is_trial_period?: boolean
    cancel_reason?: string
    grace_period_expiration_at_ms?: number
    auto_resume_at_ms?: number
  }
}

interface WebhookResponse {
  success: boolean
  message: string
  eventId: string
  processed: boolean
}

// Helper function to verify webhook signature
async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return signature.toLowerCase() === expectedSignature.toLowerCase()
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// Helper function to determine plan from product ID
function getPlanFromProductId(productId: string): string {
  const planMapping: Record<string, string> = {
    'premium_monthly': 'starter',
    'premium_yearly': 'starter',
    'pro_monthly': 'pro',
    'pro_yearly': 'pro',
    'enterprise_monthly': 'enterprise',
    'enterprise_yearly': 'enterprise'
  }
  
  return planMapping[productId] || 'free'
}

// Helper function to get generation limits based on plan
function getGenerationLimits(planId: string): number {
  const limits: Record<string, number> = {
    'free': 5,
    'starter': 50,
    'pro': 200,
    'enterprise': -1 // unlimited
  }
  
  return limits[planId] || 5
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      console.error('REVENUECAT_WEBHOOK_SECRET not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error', 
          message: 'Webhook secret not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('x-revenuecat-signature')

    if (!signature) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Signature', 
          message: 'Webhook signature is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(body, signature, webhookSecret)
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature')
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Signature', 
          message: 'Webhook signature verification failed' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the webhook payload
    let webhookData: RevenueCatEvent
    try {
      webhookData = JSON.parse(body)
    } catch (parseError) {
      console.error('Failed to parse webhook payload:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Payload', 
          message: 'Unable to parse webhook payload' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const event = webhookData.event
    const eventId = event.id
    const eventType = event.type
    const appUserId = event.app_user_id

    console.log(`Processing RevenueCat event: ${eventType} for user: ${appUserId}`)

    // Check for duplicate events (idempotency)
    const { data: existingEvent } = await supabaseClient
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existingEvent) {
      console.log(`Event ${eventId} already processed, skipping`)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Event already processed',
          eventId: eventId,
          processed: false
        } as WebhookResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log the webhook event
    const { error: logError } = await supabaseClient
      .from('webhook_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        app_user_id: appUserId,
        payload: webhookData,
        processed_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Failed to log webhook event:', logError)
    }

    // Find the user by app_user_id (which should match the Supabase user ID)
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', appUserId)
      .single()

    if (userError || !user) {
      console.error(`User not found for app_user_id: ${appUserId}`)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
          eventId: eventId,
          processed: false
        } as WebhookResponse),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process different event types
    let updateData: any = {}
    let subscriptionStatus = 'free'
    let planId = 'free'

    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE':
        if (event.product_id) {
          planId = getPlanFromProductId(event.product_id)
          subscriptionStatus = 'premium'
          
          updateData = {
            plan_id: planId,
            subscription_status: subscriptionStatus,
            generation_limit: getGenerationLimits(planId),
            stripe_customer_id: event.original_transaction_id || null,
            updated_at: new Date().toISOString()
          }
        }
        break

      case 'CANCELLATION':
      case 'EXPIRATION':
        subscriptionStatus = 'free'
        planId = 'free'
        
        updateData = {
          plan_id: planId,
          subscription_status: subscriptionStatus,
          generation_limit: getGenerationLimits(planId),
          current_generation_count: 0, // Reset count on cancellation
          updated_at: new Date().toISOString()
        }
        break

      case 'BILLING_ISSUE':
        subscriptionStatus = 'past_due'
        
        updateData = {
          subscription_status: subscriptionStatus,
          updated_at: new Date().toISOString()
        }
        break

      case 'SUBSCRIBER_ALIAS':
        // Handle user ID changes/aliases
        console.log(`Subscriber alias event for ${appUserId}`)
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
        break
    }

    // Update user subscription data if we have updates
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseClient
        .from('users')
        .update(updateData)
        .eq('id', appUserId)

      if (updateError) {
        console.error('Failed to update user subscription:', updateError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to update user subscription',
            eventId: eventId,
            processed: false
          } as WebhookResponse),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Updated user ${appUserId} subscription to ${subscriptionStatus} (${planId})`)
    }

    // Track subscription metrics
    const today = new Date().toISOString().split('T')[0]
    const { error: metricsError } = await supabaseClient
      .from('subscription_metrics')
      .upsert({
        date: today,
        event_type: eventType,
        plan_id: planId,
        user_id: appUserId,
        revenue: event.price || 0,
        currency: event.currency || 'USD',
        created_at: new Date().toISOString()
      })

    if (metricsError) {
      console.error('Failed to track subscription metrics:', metricsError)
    }

    // Prepare success response
    const response: WebhookResponse = {
      success: true,
      message: `Successfully processed ${eventType} event`,
      eventId: eventId,
      processed: true
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected webhook processing error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        eventId: 'unknown',
        processed: false
      } as WebhookResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})