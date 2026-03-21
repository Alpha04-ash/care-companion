import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDSm_J3BQS2G-pkfqOogVa-B9hPxCKTH8I';
  
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `
Analyze the following conversation between an elderly person and a health companion. 
Extract and return ONLY a valid JSON object with these fields:
- moodScore: number from 1-10
- sleepQuality: number from 1-10
- painLevel: number from 1-10
- appetite: number from 1-10 (renamed from appetiteScore for consistency)
- social: number from 1-10 (renamed from socialScore for consistency)
- redFlags: string[] (concerns about loneliness, confusion, pain, distress)
- summary: string (2-3 sentence summary)

Conversation:
${transcript}
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Clean up markdown formatting if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const analysis = JSON.parse(text);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        raw: text 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Analysis API Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
