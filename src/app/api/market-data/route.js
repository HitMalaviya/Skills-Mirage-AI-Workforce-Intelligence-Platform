import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const prompt = `You are a workforce intelligence data engine. Generate CURRENT Indian job market data as of March 2026.

Return ONLY valid JSON (no markdown, no backticks) with this EXACT structure:

{
  "generatedAt": "2026-03-11T00:00:00Z",
  "hiringData": {
    "totalListings": "45,200",
    "growthRate": "+16%",
    "topCity": "Bangalore",
    "jobVolume": [
      { "name": "Week 1", "jobs": 5200 },
      { "name": "Week 2", "jobs": 4800 },
      { "name": "Week 3", "jobs": 5500 },
      { "name": "Week 4", "jobs": 5100 },
      { "name": "Week 5", "jobs": 5900 },
      { "name": "Week 6", "jobs": 6200 },
      { "name": "Week 7", "jobs": 6800 }
    ],
    "categoryTrend": [
      { "name": "Software Dev", "current": 14200, "previous": 12100 },
      { "name": "Data Science", "current": 9800, "previous": 7500 },
      { "name": "Customer Support", "current": 4200, "previous": 5800 },
      { "name": "Marketing", "current": 4600, "previous": 4200 },
      { "name": "Finance", "current": 4100, "previous": 3800 }
    ],
    "cityHiring": [
      { "name": "Bangalore", "value": 94 },
      { "name": "Pune", "value": 87 },
      { "name": "Hyderabad", "value": 84 },
      { "name": "Chennai", "value": 76 },
      { "name": "Mumbai", "value": 72 },
      { "name": "Gurgaon", "value": 70 },
      { "name": "Noida", "value": 66 },
      { "name": "Indore", "value": 60 },
      { "name": "Coimbatore", "value": 55 },
      { "name": "Ahmedabad", "value": 52 }
    ],
    "sectorDistribution": [
      { "name": "IT", "value": 42 },
      { "name": "BPO", "value": 18 },
      { "name": "Finance", "value": 16 },
      { "name": "Healthcare", "value": 13 },
      { "name": "Retail", "value": 11 }
    ],
    "topCompanies": [
      { "id": 1, "name": "Infosys", "jobs": 1450, "sector": "IT" },
      { "id": 2, "name": "TCS", "jobs": 1300, "sector": "IT" },
      { "id": 3, "name": "Accenture", "jobs": 1100, "sector": "IT" },
      { "id": 4, "name": "Amazon", "jobs": 920, "sector": "E-commerce" },
      { "id": 5, "name": "HDFC Bank", "jobs": 710, "sector": "Finance" }
    ],
    "emergingRoles": [
      { "id": 1, "title": "AI Prompt Engineer", "tags": ["Emerging", "High Demand"] },
      { "id": 2, "title": "GenAI Developer", "tags": ["Hot", "Premium Salary"] },
      { "id": 3, "title": "Cloud Security Analyst", "tags": ["Critical Need", "Deficit"] },
      { "id": 4, "title": "MLOps Engineer", "tags": ["Emerging", "Steady Growth"] }
    ],
    "growthIndicators": [
      { "category": "AI/ML", "change": "+35%", "isPositive": true },
      { "category": "Data Science", "change": "+24%", "isPositive": true },
      { "category": "Customer Support", "change": "-18%", "isPositive": false },
      { "category": "Data Entry", "change": "-32%", "isPositive": false }
    ],
    "cityInsights": {
      "Bangalore": "Bangalore leads with 9,400+ active IT job listings. Strong demand in AI/ML and cloud architecture. The city shows 18% YoY growth driven by AI adoption.",
      "Pune": "Pune ranks #2 with 5,800 listings. Growing fintech and SaaS sectors drive demand. Data engineering roles are spiking +28%.",
      "Hyderabad": "Hyderabad holds #3 with 5,200 listings. Pharmaceutical IT and cloud corridors fuel hiring. AI/ML roles up +35%.",
      "Delhi NCR": "Delhi NCR at #4 with 4,900 listings. Diverse demand across finance, e-commerce, and enterprise IT.",
      "Mumbai": "Mumbai at #5 with 4,500 listings. Financial services and media tech dominate. Fintech hiring up 30%.",
      "Chennai": "Chennai at #6 with 3,900 listings. Automotive tech and semiconductor design roles growing rapidly.",
      "Indore": "Indore at #7 with 2,100 listings. Fastest growing Tier-2 IT hub with 45% YoY growth.",
      "Jaipur": "Jaipur at #8 with 1,400 listings. Startup ecosystem and remote-first companies expanding.",
      "Surat": "Surat at #9 with 1,100 listings. Diamond and textile industry digitization creating new tech roles.",
      "Lucknow": "Lucknow at #10 with 850 listings. Government IT and defense tech initiatives boosting market."
    }
  },
  "skillsData": {
    "risingSkills": [
      { "id": 1, "name": "Generative AI", "growth": "+52%" },
      { "id": 2, "name": "Prompt Engineering", "growth": "+45%" },
      { "id": 3, "name": "Cloud Architecture", "growth": "+28%" },
      { "id": 4, "name": "Python", "growth": "+24%" },
      { "id": 5, "name": "Cybersecurity", "growth": "+22%" },
      { "id": 6, "name": "LLM Fine-tuning", "growth": "+20%" },
      { "id": 7, "name": "Data Engineering", "growth": "+18%" },
      { "id": 8, "name": "React/Next.js", "growth": "+15%" }
    ],
    "decliningSkills": [
      { "id": 1, "name": "Data Entry", "decline": "-38%" },
      { "id": 2, "name": "Telemarketing", "decline": "-32%" },
      { "id": 3, "name": "Manual QA Testing", "decline": "-26%" },
      { "id": 4, "name": "Basic Copywriting", "decline": "-22%" }
    ],
    "skillDemandTimeline": [
      { "year": "2021", "Python": 55, "GenAI": 8, "React": 68, "Java": 78 },
      { "year": "2022", "Python": 68, "GenAI": 25, "React": 76, "Java": 72 },
      { "year": "2023", "Python": 82, "GenAI": 62, "React": 84, "Java": 66 },
      { "year": "2024", "Python": 90, "GenAI": 85, "React": 88, "Java": 60 },
      { "year": "2025", "Python": 94, "GenAI": 96, "React": 90, "Java": 55 }
    ],
    "skillGap": [
      { "skill": "Gen AI Integration", "demand": "Very High", "available": "Very Low", "gapStatus": "large" },
      { "skill": "Python/ML", "demand": "High", "available": "Medium", "gapStatus": "moderate" },
      { "skill": "Cloud (AWS/GCP)", "demand": "Very High", "available": "Medium", "gapStatus": "moderate" },
      { "skill": "AI Prompting", "demand": "High", "available": "Low", "gapStatus": "large" },
      { "skill": "Data Structures", "demand": "Medium", "available": "High", "gapStatus": "covered" }
    ],
    "skillScores": [
      { "id": 1, "name": "Python", "score": 96 },
      { "id": 2, "name": "SQL", "score": 90 },
      { "id": 3, "name": "React", "score": 87 },
      { "id": 4, "name": "Docker", "score": 80 },
      { "id": 5, "name": "TensorFlow", "score": 75 }
    ],
    "skillClusters": [
      { "category": "AI/ML Engineering", "skills": ["Python", "TensorFlow", "PyTorch", "MLOps", "LangChain"] },
      { "category": "Full-Stack Dev", "skills": ["JavaScript", "React", "Next.js", "Node.js", "TypeScript"] },
      { "category": "Cloud DevOps", "skills": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] }
    ],
    "industrySkillData": [
      { "name": "Python/AI", "category": "IT", "value": 92 },
      { "name": "Medical Coding", "category": "Healthcare", "value": 68 },
      { "name": "Marketing Analytics", "category": "Marketing", "value": 78 },
      { "name": "Financial Modeling", "category": "Finance", "value": 72 }
    ]
  },
  "riskData": {
    "roleRiskScores": [
      { "id": 1, "role": "Data Entry Clerk", "score": 92, "level": "Critical Risk" },
      { "id": 2, "role": "Telemarketer", "score": 88, "level": "High Risk" },
      { "id": 3, "role": "Content Writer (Basic)", "score": 80, "level": "High Risk" },
      { "id": 4, "role": "Customer Support (L1)", "score": 76, "level": "High Risk" },
      { "id": 5, "role": "Graphic Designer (Basic)", "score": 68, "level": "Moderate Risk" },
      { "id": 6, "role": "Frontend Developer", "score": 42, "level": "Moderate Risk" },
      { "id": 7, "role": "Data Analyst", "score": 28, "level": "Low Risk" },
      { "id": 8, "role": "AI/ML Engineer", "score": 8, "level": "Very Low Risk" }
    ],
    "cityRisk": [
      { "city": "Pune", "riskLevel": "High", "score": 78 },
      { "city": "Bangalore", "riskLevel": "Medium", "score": 52 },
      { "city": "Indore", "riskLevel": "Medium", "score": 48 },
      { "city": "Hyderabad", "riskLevel": "Low", "score": 38 },
      { "city": "Chennai", "riskLevel": "Low", "score": 32 }
    ],
    "riskTrend": [
      { "month": "Nov", "CustomerSupport": 68, "ContentWriter": 65, "DataAnalyst": 20 },
      { "month": "Dec", "CustomerSupport": 71, "ContentWriter": 70, "DataAnalyst": 21 },
      { "month": "Jan", "CustomerSupport": 74, "ContentWriter": 74, "DataAnalyst": 22 },
      { "month": "Feb", "CustomerSupport": 76, "ContentWriter": 78, "DataAnalyst": 22 },
      { "month": "Mar", "CustomerSupport": 78, "ContentWriter": 80, "DataAnalyst": 23 }
    ],
    "automationForecast": [
      { "role": "Telemarketing", "currentRisk": 82, "projectedRisk": 95 },
      { "role": "Translation Services", "currentRisk": 72, "projectedRisk": 90 },
      { "role": "Basic Coding Support", "currentRisk": 55, "projectedRisk": 78 }
    ],
    "aiToolAdoption": [
      { "name": "ChatGPT / LLMs", "growth": "+250%" },
      { "name": "GitHub Copilot", "growth": "+180%" },
      { "name": "Midjourney/Flux", "growth": "+140%" },
      { "name": "AI Customer Bots", "growth": "+110%" }
    ],
    "safeCareers": [
      { "id": 1, "title": "AI/ML Engineer", "desc": "Building and fine-tuning intelligent systems" },
      { "id": 2, "title": "AI Ethics Consultant", "desc": "Governance and responsible AI deployment" },
      { "id": 3, "title": "Healthcare Professional", "desc": "Deep empathy and clinical judgment" },
      { "id": 4, "title": "Strategic Business Advisor", "desc": "High-level decision making and relationships" }
    ]
  }
}

IMPORTANT: Generate REALISTIC, CURRENT data for the Indian job market as of early 2026. Update all numbers, percentages, and insights to reflect the LATEST trends. Consider:
- AI adoption acceleration in Indian enterprises
- Impact of Gen AI tools on traditional roles  
- Growth of tier-2 city tech hubs
- Government initiatives (PMKVY, Skill India)
- Current hiring freezes or booms in specific sectors
Return ONLY the JSON, nothing else.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a workforce data intelligence engine. Return ONLY valid JSON matching the exact schema provided. No markdown.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const raw = chatCompletion.choices[0]?.message?.content || '';

    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return NextResponse.json({ error: 'Failed to parse market data. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { error: 'Failed to generate market data.' },
      { status: 500 }
    );
  }
}
