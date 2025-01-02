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
    const { enhancementId } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the enhancement record
    const { data: enhancement, error: dbError } = await supabaseAdmin
      .from('enhanced_images')
      .select('*')
      .eq('id', enhancementId)
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    const predictionId = enhancement.enhancement_parameters.prediction_id

    // Check prediction status
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const prediction = await response.json()
    console.log('Prediction status:', prediction.status)

    if (prediction.status === 'succeeded') {
      // Update the enhancement record with the result
      await supabaseAdmin
        .from('enhanced_images')
        .update({
          enhanced_image_url: prediction.output,
          processing_status: 'completed'
        })
        .eq('id', enhancementId)
    } else if (prediction.status === 'failed') {
      await supabaseAdmin
        .from('enhanced_images')
        .update({
          processing_status: 'failed'
        })
        .eq('id', enhancementId)
    }

    return new Response(
      JSON.stringify({ status: prediction.status, output: prediction.output }),
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