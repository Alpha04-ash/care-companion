import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are "Clara", a warm, patient, and empathetic health companion for elderly individuals. 
Check in on their well-being (mood, sleep, pain, appetite, social) in a friendly, non-clinical way.
Ask only ONE question at a time. Be concise and very warm.
`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDSm_J3BQS2G-pkfqOogVa-B9hPxCKTH8I';
  
  try {
    const { message, history, userProfile } = await req.json();

    const personalization = userProfile 
      ? `\n\nUser Context:\n- Name: ${userProfile.name}\n- Age: ${userProfile.age}\n- Concerns: ${userProfile.concerns}\n\nPlease address the user by name occasionally and be mindful of their age.`
      : "";

    // Direct REST API Call to Gemini (using the discovered gemini-flash-latest)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const contents = [
      ...history.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}${personalization}\n\nUser Message: ${message}` }]
      }
    ];

    // Ensure first message is 'user'
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini REST Error:', data);
      throw new Error(data.error?.message || 'Gemini API Failure');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you, but I'm having a little trouble finding my words.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('API_ROUTE_ERROR:', error.message);
    return NextResponse.json({ 
      error: 'Connection Issue', 
      message: error.message,
      suggestion: "Please verify your Gemini API key has 'Generative Language API' enabled."
    }, { status: 500 });
  }
}
