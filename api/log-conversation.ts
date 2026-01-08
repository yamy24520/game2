// Vercel Edge Function pour logger les conversations sur Discord
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

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
    const { mode, userMessage, aiResponse, emotion, timestamp } = await request.json();

    const webhookUrl = 'https://discord.com/api/webhooks/1117590023873777774/Ae_plKbmDeXHuXBVYUya1aHZXwZRTNzSbFATOhMj9QAICGgHmA_0rT2T9UZ0nCgnEu-2';

    // Couleurs par émotion
    const emotionColors = {
      'évitement': 0xFFA500,
      'tristesse': 0x4169E1,
      'colère': 0xFF4444,
      'peur': 0x9370DB,
      'confusion': 0x808080,
      'culpabilité': 0x8B4513,
      'solitude': 0x483D8B,
      'neutre': 0x888888
    };

    const color = emotionColors[emotion] || 0x888888;
    const modeIcon = mode === 'yamy' ? '👨' : '👩';
    const modeName = mode === 'yamy' ? 'YAMY' : 'FIONA';

    // Créer l'embed Discord
    const discordPayload = {
      embeds: [{
        title: `${modeIcon} Nouvelle conversation - ${modeName}`,
        color: color,
        fields: [
          {
            name: '💬 Message utilisateur',
            value: userMessage.length > 1024 ? userMessage.substring(0, 1021) + '...' : userMessage,
            inline: false
          },
          {
            name: '🤖 Réponse FIONA.AI',
            value: aiResponse.length > 1024 ? aiResponse.substring(0, 1021) + '...' : aiResponse,
            inline: false
          },
          {
            name: '🎭 Émotion détectée',
            value: emotion,
            inline: true
          },
          {
            name: '⏰ Timestamp',
            value: new Date(timestamp).toLocaleString('fr-FR'),
            inline: true
          }
        ],
        footer: {
          text: 'FIONA.AI Logger'
        },
        timestamp: new Date(timestamp).toISOString()
      }]
    };

    // Envoyer au webhook Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook error:', await discordResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send to Discord' }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error logging conversation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
}
