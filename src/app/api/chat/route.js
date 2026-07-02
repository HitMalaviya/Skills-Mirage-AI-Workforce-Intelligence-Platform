import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are "Skills Mirage AI", a career advisor built for Indian workers navigating the AI-driven job market. You are part of the Skills Mirage Workforce Intelligence System.

Your role:
- Help workers understand their AI automation risk
- Suggest career transition paths and safer roles
- Recommend specific courses from NPTEL, SWAYAM, PMKVY, Coursera, YouTube, and Kaggle
- Provide personalized reskilling guidance
- Support both English and Hindi languages

Key knowledge:
- Risk Score Formula: risk_score = (0.4 × automation_score) + (0.3 × demand_decline) + (0.3 × skill_replaceability)
- High-risk roles: Customer Support, Data Entry, Telemarketing, Content Writing
- Low-risk roles: AI/ML Engineer, DevOps, Cybersecurity, Data Engineering, Healthcare IT
- Rising skills: Gen AI, Python, Cloud Computing, React, Data Science
- Declining skills: Manual Testing, Basic Excel, Data Entry, Cold Calling

Be concise, practical, and encouraging. Use bullet points. If asked in Hindi, respond in Hindi.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
