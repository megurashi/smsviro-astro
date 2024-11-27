import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const from = import.meta.env.SENDER_ID_SMSVIRO;
  const to = data.to;
  const text = data.text;

  // Validasi data
  if (!from || !to || !text) {
    return new Response(
      JSON.stringify({
        message: 'Missing required fields',
      }),
      { status: 400 }
    );
  }

  const res = await fetch('https://api.smsviro.com/restapi/sms/1/text/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `App ${import.meta.env.API_KEY_SMSVIRO}`,
    },
    body: JSON.stringify({
      from: from,
      to: to,
      text: text,
    }),
  });

  const result = await res.json();
  return new Response(
    JSON.stringify(result),
    { status: res.status }
  );
};
