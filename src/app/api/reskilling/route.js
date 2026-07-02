import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Build a real search URL for each platform so links always work
function buildSearchUrl(platform, courseName) {
  const query = encodeURIComponent(courseName);
  const platformLower = (platform || '').toLowerCase();

  if (platformLower.includes('nptel')) return `https://nptel.ac.in/courses#q=${query}`;
  if (platformLower.includes('swayam')) return `https://swayam.gov.in/explorer?searchText=${query}`;
  if (platformLower.includes('coursera')) return `https://www.coursera.org/search?query=${query}`;
  if (platformLower.includes('youtube')) return `https://www.youtube.com/results?search_query=${query}`;
  if (platformLower.includes('kaggle')) return `https://www.kaggle.com/search?q=${query}`;
  if (platformLower.includes('udemy')) return `https://www.udemy.com/courses/search/?q=${query}`;
  if (platformLower.includes('pmkvy')) return `https://www.pmkvyofficial.org/`;
  // Fallback: Google search
  return `https://www.google.com/search?q=${query}+${encodeURIComponent(platform)}+course`;
}

// Post-process the roadmap to replace hallucinated URLs with real search URLs
function fixRoadmapUrls(roadmap) {
  if (!roadmap || !roadmap.weeks) return roadmap;

  roadmap.weeks = roadmap.weeks.map(week => {
    if (week.resources) {
      week.resources = week.resources.map(res => ({
        ...res,
        url: buildSearchUrl(res.platform, res.name),
      }));
    }
    return week;
  });

  return roadmap;
}

export async function POST(request) {
  try {
    const { currentRole, targetRole, experience, skills, preferences } = await request.json();

    if (!currentRole || !targetRole) {
      return NextResponse.json({ error: 'Current role and target role are required' }, { status: 400 });
    }

    const prompt = `Generate a personalized 8-week reskilling roadmap for an Indian worker with the following profile:

- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Experience: ${experience || 'Not specified'} years
- Current Skills: ${skills || 'Not specified'}
- Preferences: ${preferences || 'No specific preferences'}

Return ONLY valid JSON (no markdown, no backticks) in this exact format:
{
  "title": "Transition: [Current Role] → [Target Role]",
  "summary": "Brief 2-line summary of the transition plan",
  "weeks": [
    {
      "period": "Week 1-2",
      "topic": "Topic name",
      "description": "What to learn and why",
      "resources": [
        { "name": "Course/Resource Name", "platform": "NPTEL/Coursera/YouTube/Kaggle/SWAYAM", "url": "#", "type": "Course/Video/Tutorial/Notebook", "free": true }
      ]
    }
  ],
  "careerTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Rules:
- Always include 4 week-blocks (Week 1-2, Week 3-4, Week 5-6, Week 7-8)
- Each week should have 2-3 resources from different platforms
- Prioritize free Indian resources (NPTEL, SWAYAM, PMKVY) alongside global ones (Coursera, YouTube, Kaggle)
- Set url to "#" for all resources (URLs will be auto-generated)
- Use real, specific course names that actually exist on these platforms
- Make each week progressively more advanced
- Be specific to the Indian job market context`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career transition expert specializing in the Indian job market. Return ONLY valid JSON, no markdown formatting.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 2048,
    });

    const raw = chatCompletion.choices[0]?.message?.content || '';

    // Try to parse JSON - handle potential markdown wrapping
    let roadmap;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      roadmap = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI roadmap. Please try again.' }, { status: 500 });
    }

    // Fix all URLs to be real search URLs instead of hallucinated ones
    roadmap = fixRoadmapUrls(roadmap);

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Groq reskilling error:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap. Please try again.' },
      { status: 500 }
    );
  }
}
