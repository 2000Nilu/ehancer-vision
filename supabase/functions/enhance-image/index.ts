import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, modelType, userId } = await req.json()

    // Select the appropriate model based on type
    const model = modelType === 'GFPGAN' 
      ? 'tencentarc/gfpgan/9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3'
      : 'nightmareai/real-esrgan/42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b'

    console.log(`Starting enhancement with model: ${modelType}`)

    // Start the enhancement process with Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model,
        input: { image: imageUrl }
      })
    })

    const prediction = await response.json()
    console.log('Prediction started:', prediction)

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create enhancement record
    const { data: enhancementRecord, error: dbError } = await supabaseAdmin
      .from('enhanced_images')
      .insert({
        user_id: userId,
        original_image_url: imageUrl,
        enhanced_image_url: '',
        processing_status: 'processing',
        model_used: modelType,
        enhancement_parameters: { prediction_id: prediction.id }
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Enhancement started',
        enhancementId: enhancementRecord.id,
        prediction 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})