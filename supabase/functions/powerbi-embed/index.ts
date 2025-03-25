
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the report ID from the URL
    const url = new URL(req.url)
    const reportId = url.searchParams.get('reportId')

    if (!reportId) {
      return new Response(
        JSON.stringify({ error: 'Report ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Call the PowerBI API to get an embed token
    // 2. Return the token and embed URL

    // For now, return mock data
    const mockResponse = {
      embedToken: "mockToken123456",
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}`,
      reportId
    }

    return new Response(
      JSON.stringify(mockResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error getting PowerBI embed info:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
