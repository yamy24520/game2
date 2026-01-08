// Vercel Edge Function pour l'API Anthropic
// Pas de problème CORS car tout passe par le même domaine

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const { model, max_tokens, system, messages } = await request.json();

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages,
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return new Response(
        JSON.stringify(errorData),
        { status: apiResponse.status, headers }
      );
    }

    const data = await apiResponse.json();
    return new Response(JSON.stringify(data), { status: 200, headers });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      { status: 500, headers }
    );
  }
}
