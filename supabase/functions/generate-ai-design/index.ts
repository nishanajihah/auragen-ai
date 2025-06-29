/*
  # AI Design Generation Edge Function

  1. Features
    - Secure JWT authentication
    - User generation limit checking
    - Gemini AI integration for design system generation
    - Usage tracking and analytics
    - Rate limiting and error handling

  2. Security
    - JWT token validation
    - User authorization checks
    - API key protection via Supabase Secrets
    - Input sanitization and validation

  3. Database Operations
    - User limit verification
    - Usage tracking updates
    - Design history management
*/

import { serve } from "std/http/server.ts"
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DesignRequest {
  prompt: string
  style?: string
  colorPreferences?: string[]
  fontPreferences?: {
    heading?: string
    body?: string
  }
  regenerateSection?: string
  currentDesign?: any
}

interface DesignResponse {
  message: string
  design?: any
  isComplete: boolean
  usage: {
    charactersUsed: number
    generationsRemaining: number
    resetTime: string
  }
}

interface UserLimits {
  id: string
  plan_id: string
  generation_limit: number
  current_generation_count: number
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
    const { prompt, style, colorPreferences, fontPreferences, regenerateSection, currentDesign }: DesignRequest = await req.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Bad Request', 
          message: 'Prompt is required and must be a non-empty string' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user limits and current usage
    const { data: userLimits, error: limitsError } = await supabaseClient
      .from('users')
      .select('id, plan_id, generation_limit, current_generation_count, subscription_status')
      .eq('id', user.id)
      .single()

    if (limitsError || !userLimits) {
      return new Response(
        JSON.stringify({ 
          error: 'User Not Found', 
          message: 'Unable to retrieve user information' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const typedUserLimits = userLimits as UserLimits

    // Check generation limits (skip for premium/unlimited plans)
    if (typedUserLimits.generation_limit !== -1 && 
        typedUserLimits.current_generation_count >= typedUserLimits.generation_limit) {
      
      // Calculate reset time (next day at midnight UTC)
      const tomorrow = new Date()
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
      tomorrow.setUTCHours(0, 0, 0, 0)

      return new Response(
        JSON.stringify({
          error: 'Limit Exceeded',
          message: `You've reached your daily limit of ${typedUserLimits.generation_limit} generations. Upgrade to Premium for unlimited access.`,
          usage: {
            charactersUsed: 0,
            generationsRemaining: 0,
            resetTime: tomorrow.toISOString()
          }
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Gemini API configuration from Supabase Secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const geminiModelId = Deno.env.get('GEMINI_MODEL_ID') || 'gemini-1.5-flash'

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error', 
          message: 'AI service is temporarily unavailable' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create system prompt
    const systemPrompt = `You are AuraGen AI, an expert UI/UX design assistant that creates comprehensive design systems. You help users create beautiful, professional design systems through conversation.

CRITICAL: You MUST respond with valid JSON in this exact format:
{
  "message": "Your conversational response to the user",
  "design": {
    "vibeSummary": "Brief description of the design vibe",
    "colorPalettes": [
      {
        "name": "Palette Name",
        "purpose": "Purpose description",
        "colors": [
          {
            "name": "Color Name",
            "hex": "#HEXCODE",
            "rgb": "rgb(r, g, b)",
            "hsl": "hsl(h, s%, l%)",
            "description": "Color description and psychology",
            "usage": "Where and how to use this color"
          }
        ]
      }
    ],
    "fontPairing": {
      "heading": {
        "name": "Font Name",
        "googleFont": "Google+Font+Name:wght@weights",
        "fallback": "fallback-family",
        "category": "serif|sans-serif|display|monospace",
        "weights": [400, 500, 600, 700],
        "sizes": {
          "h1": "4rem",
          "h2": "3rem",
          "h3": "2.25rem",
          "h4": "1.875rem",
          "h5": "1.5rem",
          "h6": "1.25rem"
        }
      },
      "body": {
        "name": "Font Name",
        "googleFont": "Google+Font+Name:wght@weights",
        "fallback": "fallback-family",
        "category": "serif|sans-serif|display|monospace",
        "weights": [300, 400, 500, 600],
        "sizes": {
          "large": "1.25rem",
          "regular": "1rem",
          "small": "0.875rem",
          "caption": "0.75rem"
        }
      }
    },
    "visualInspiration": [
      {
        "title": "Inspiration Title",
        "description": "Detailed description",
        "mood": "Mood description",
        "colors": ["#hex1", "#hex2"],
        "elements": ["element1", "element2"],
        "useCases": ["usecase1", "usecase2"],
        "prompt": "AI image generation prompt"
      }
    ],
    "componentSuggestions": [
      {
        "component": "Component Name",
        "description": "Component description",
        "styling": "Tailwind CSS classes",
        "category": "interactive|forms|feedback|layout|navigation",
        "states": {
          "default": "default styling",
          "hover": "hover styling",
          "focus": "focus styling",
          "active": "active styling",
          "disabled": "disabled styling"
        }
      }
    ],
    "designPrinciples": {
      "spacing": "Spacing system description",
      "borderRadius": "Border radius system",
      "shadows": "Shadow system",
      "animations": "Animation guidelines"
    }
  },
  "isComplete": true
}`

    // Prepare the prompt
    let finalPrompt = systemPrompt
    
    // Add user preferences if provided
    let userPreferences = ""
    if (style) {
      userPreferences += `\nStyle preference: ${style}`
    }
    if (colorPreferences && colorPreferences.length > 0) {
      userPreferences += `\nColor preferences: ${colorPreferences.join(', ')}`
    }
    if (fontPreferences) {
      if (fontPreferences.heading) {
        userPreferences += `\nHeading font preference: ${fontPreferences.heading}`
      }
      if (fontPreferences.body) {
        userPreferences += `\nBody font preference: ${fontPreferences.body}`
      }
    }
    
    if (regenerateSection && currentDesign) {
      finalPrompt += `\n\nCurrent design system context:\n${JSON.stringify(currentDesign, null, 2)}\n\nUser request: Regenerate the ${regenerateSection} section. ${prompt}${userPreferences}`
    } else {
      finalPrompt += `\n\nUser request: ${prompt}${userPreferences}\n\nRespond with valid JSON only:`
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelId}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: finalPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API Error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'AI Service Error', 
          message: 'The AI service is temporarily unavailable. Please try again in a moment.' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const geminiData = await geminiResponse.json()
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'AI Response Error', 
          message: 'Unable to generate a response. Please try rephrasing your request.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const responseText = geminiData.candidates[0].content.parts[0].text

    // Parse JSON response
    let parsedResponse
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      
      return new Response(
        JSON.stringify({
          error: 'Response Parse Error',
          message: 'Unable to process the AI response. Please try again.'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update user generation count
    const { error: updateError } = await supabaseClient
      .from('users')
      .update({ 
        current_generation_count: typedUserLimits.current_generation_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update user generation count:', updateError)
    }

    // Track usage in usage_tracking table
    const today = new Date().toISOString().split('T')[0]
    const { error: usageError } = await supabaseClient
      .from('usage_tracking')
      .upsert({
        user_id: user.id,
        date: today,
        generations: typedUserLimits.current_generation_count + 1,
        last_updated: new Date().toISOString()
      })

    if (usageError) {
      console.error('Failed to track usage:', usageError)
    }

    // Calculate remaining generations and reset time
    const generationsRemaining = typedUserLimits.generation_limit === -1 ? 
      -1 : // unlimited
      Math.max(0, typedUserLimits.generation_limit - (typedUserLimits.current_generation_count + 1))
    
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)

    // Prepare response
    const response: DesignResponse = {
      message: parsedResponse.message || 'Design system generated successfully!',
      design: parsedResponse.design || parsedResponse.moodboard, // Support both design and moodboard keys
      isComplete: parsedResponse.isComplete || !!(parsedResponse.design || parsedResponse.moodboard),
      usage: {
        charactersUsed: prompt.length,
        generationsRemaining: generationsRemaining,
        resetTime: tomorrow.toISOString()
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