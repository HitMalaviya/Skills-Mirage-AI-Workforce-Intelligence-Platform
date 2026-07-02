import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { jobTitle, city, experience, about } = await request.json();

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
    }

    const prompt = `Analyze this Indian worker's career profile for AI automation vulnerability:

- Job Title: ${jobTitle}
- City: ${city || 'Not specified'}
- Experience: ${experience || 'Not specified'} years
- About: ${about || 'Not specified'}

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "riskScore": <number 0-100>,
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "automationScore": <number 0-100>,
  "demandDecline": <number 0-100>,
  "skillReplaceability": <number 0-100>,
  "narrative": "A detailed 3-4 sentence qualitative assessment of their career risk, specific to their role and city in India.",
  "detectedSkills": [
    { "name": "Skill Name", "score": <0-100> }
  ],
  "radarScores": {
    "technical": <0-100>,
    "problemSolving": <0-100>,
    "communication": <0-100>,
    "management": <0-100>,
    "adaptability": <0-100>,
    "leadership": <0-100>
  },
  "saferAlternatives": ["Role 1", "Role 2", "Role 3"],
  "topRecommendation": "One-line actionable recommendation"
}

Use the formula: risk_score = (0.4 * automation_score) + (0.3 * demand_decline) + (0.3 * skill_replaceability)
Be realistic and specific to the Indian job market.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a workforce intelligence AI specializing in the Indian job market. Return ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500,
    });

    const raw = chatCompletion.choices[0]?.message?.content || '';

    let analysis;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return NextResponse.json({ error: 'Failed to parse analysis. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Groq analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze profile. Please try again.' },
      { status: 500 }
    );
  }
}
