/*
  # Text-to-Speech Edge Function

  1. Features
    - ElevenLabs API integration
    - User authentication and subscription verification
    - Character usage tracking and limits
    - Audio generation with custom voice settings
    - Usage analytics and rate limiting

  2. Security
    - JWT token validation
    - Subscription status verification
    - API key protection via Supabase Secrets
    - Input validation and sanitization

  3. Database Operations
    - Character usage tracking
    - Subscription verification
    - Usage limit enforcement
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TTSRequest {
  text: string
  voiceId?: string
  voiceSettings?: {
    stability?: number
    similarity_boost?: number
    style?: number
    use_speaker_boost?: boolean
  }
}

interface TTSResponse {
  audioUrl: string
  usage: {
    charactersUsed: number
    charactersRemaining: number
    resetTime: string
  }
  voiceInfo: {
    voiceId: string
    voiceName: string
  }
}

interface UserSubscription {
  id: string
  plan_id: string
  subscription_status: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify JWT and get user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Invalid or missing authentication token' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { text, voiceId, voiceSettings }: TTSRequest = await req.json()

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Bad Request', 
          message: 'Text is required and must be a non-empty string' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ 
          error: 'Text Too Long', 
          message: 'Text must be 5000 characters or less' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user subscription info
    const { data: userSub, error: subError } = await supabaseClient
      .from('users')
      .select('id, plan_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (subError || !userSub) {
      return new Response(
        JSON.stringify({ 
          error: 'User Not Found', 
          message: 'Unable to retrieve user subscription information' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const typedUserSub = userSub as UserSubscription

    // Check character usage limits based on plan
    const today = new Date().toISOString().split('T')[0]
    const { data: usageData } = await supabaseClient
      .from('usage_tracking')
      .select('voice_characters')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const currentUsage = usageData?.voice_characters || 0
    const characterLimits = {
      free: 1000,
      starter: 5000,
      pro: 20000,
      premium: -1 // unlimited
    }

    const userLimit = characterLimits[typedUserSub.plan_id as keyof typeof characterLimits] || characterLimits.free
    
    if (userLimit !== -1 && currentUsage + text.length > userLimit) {
      const tomorrow = new Date()
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
      tomorrow.setUTCHours(0, 0, 0, 0)

      return new Response(
        JSON.stringify({
          error: 'Character Limit Exceeded',
          message: `You've reached your daily character limit of ${userLimit}. Upgrade your plan for more characters.`,
          usage: {
            charactersUsed: text.length,
            charactersRemaining: 0,
            resetTime: tomorrow.toISOString()
          }
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get ElevenLabs API key from Supabase Secrets
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')

    if (!elevenlabsApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error', 
          message: 'Text-to-speech service is temporarily unavailable' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Default voice settings
    const defaultVoiceId = 'pNInz6obpgDQGcFmaJgB' // Rachel voice
    const selectedVoiceId = voiceId || defaultVoiceId
    
    const defaultSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }

    const finalVoiceSettings = { ...defaultSettings, ...voiceSettings }

    // Call ElevenLabs API
    const elevenlabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenlabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: finalVoiceSettings
        })
      }
    )

    if (!elevenlabsResponse.ok) {
      const errorText = await elevenlabsResponse.text()
      console.error('ElevenLabs API Error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'TTS Service Error', 
          message: 'Text-to-speech generation failed. Please try again.' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the audio buffer
    const audioBuffer = await elevenlabsResponse.arrayBuffer()
    
    // Convert to base64 for JSON response (in production, you'd upload to storage)
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`

    // Update usage tracking
    const newVoiceCharacters = currentUsage + text.length
    const { error: usageError } = await supabaseClient
      .from('usage_tracking')
      .upsert({
        user_id: user.id,
        date: today,
        voice_characters: newVoiceCharacters,
        last_updated: new Date().toISOString()
      })

    if (usageError) {
      console.error('Failed to track voice usage:', usageError)
    }

    // Get voice information
    const voiceNames = {
      'pNInz6obpgDQGcFmaJgB': 'Rachel',
      'EXAVITQu4vr4xnSDxMaL': 'Bella',
      'ErXwobaYiN019PkySvjV': 'Antoni',
      'MF3mGyEYCl7XYWbV9V6O': 'Elli',
      'TxGEqnHWrfWFTfGW9XjX': 'Josh'
    }

    const voiceName = voiceNames[selectedVoiceId as keyof typeof voiceNames] || 'Unknown'

    // Calculate remaining characters and reset time
    const charactersRemaining = userLimit === -1 ? -1 : Math.max(0, userLimit - newVoiceCharacters)
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)

    // Prepare response
    const response: TTSResponse = {
      audioUrl: audioUrl,
      usage: {
        charactersUsed: text.length,
        charactersRemaining: charactersRemaining,
        resetTime: tomorrow.toISOString()
      },
      voiceInfo: {
        voiceId: selectedVoiceId,
        voiceName: voiceName
      }
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: 'An unexpected error occurred. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})