export const risingSkills = [
    { id: 1, name: 'Generative AI', growth: '+45%' },
    { id: 2, name: 'Prompt Engineering', growth: '+38%' },
    { id: 3, name: 'Cloud Architecture', growth: '+25%' },
    { id: 4, name: 'Python', growth: '+22%' },
    { id: 5, name: 'Cybersecurity', growth: '+18%' },
    { id: 6, name: 'Machine Learning', growth: '+15%' },
    { id: 7, name: 'Data Engineering', growth: '+14%' },
    { id: 8, name: 'React/Next.js', growth: '+12%' },
];

export const decliningSkills = [
    { id: 1, name: 'Data Entry', decline: '-35%' },
    { id: 2, name: 'Telemarketing', decline: '-28%' },
    { id: 3, name: 'Manual QA', decline: '-22%' },
    { id: 4, name: 'Basic Copywriting', decline: '-18%' },
];

export const skillDemandTimeline = [
    { year: '2020', Python: 40, 'Gen AI': 5, React: 60, Java: 80 },
    { year: '2021', Python: 55, 'Gen AI': 10, React: 70, Java: 75 },
    { year: '2022', Python: 70, 'Gen AI': 30, React: 80, Java: 70 },
    { year: '2023', Python: 90, 'Gen AI': 75, React: 85, Java: 65 },
    { year: '2024', Python: 95, 'Gen AI': 95, React: 90, Java: 60 },
];

// Day-level demand score data for last 7, 15, 30 days (date key used for labels)
function buildDayTimeline(days, baseTrend = { Python: 88, 'Gen AI': 90, React: 82, Java: 58 }) {
    return Array.from({ length: days }, (_, i) => {
        const dayNum = i + 1;
        const dateLabel = dayNum === days ? 'Today' : `${days - dayNum}d ago`;
        return {
            date: dateLabel,
            Python: Math.min(100, Math.max(0, baseTrend.Python + (i - days / 2) * 1.2 + (i % 3) * 2)),
            'Gen AI': Math.min(100, Math.max(0, baseTrend['Gen AI'] + (i - days / 2) * 0.8 + (i % 2) * 3)),
            React: Math.min(100, Math.max(0, baseTrend.React + (i - days / 2) * 1 + (i % 4) * 1.5)),
            Java: Math.min(100, Math.max(0, baseTrend.Java - i * 0.3 + (i % 3) * 1)),
        };
    });
}

export const skillDemandTimeline7Days = buildDayTimeline(7);
export const skillDemandTimeline15Days = buildDayTimeline(15);
export const skillDemandTimeline30Days = buildDayTimeline(30);

function buildMonthTimeline(months, baseTrend = { Python: 82, 'Gen AI': 86, React: 78, Java: 60 }) {
    return Array.from({ length: months }, (_, i) => {
        const monthNum = i + 1;
        const dateLabel = monthNum === months ? 'This month' : `${months - monthNum}mo ago`;
        return {
            date: dateLabel,
            Python: Math.min(100, Math.max(0, baseTrend.Python + (i - months / 2) * 1.6 + (i % 3) * 2)),
            'Gen AI': Math.min(100, Math.max(0, baseTrend['Gen AI'] + (i - months / 2) * 2.2 + (i % 2) * 2.5)),
            React: Math.min(100, Math.max(0, baseTrend.React + (i - months / 2) * 1.2 + (i % 4) * 1.2)),
            Java: Math.min(100, Math.max(0, baseTrend.Java - i * 0.6 + (i % 3) * 1)),
        };
    });
}

export const skillDemandTimeline6Months = buildMonthTimeline(6);
export const skillDemandTimeline1Year = buildMonthTimeline(12);

export const skillGapData = [
    { skill: 'Python', demand: 'High', available: 'Medium', gapStatus: 'moderate' },
    { skill: 'AI Prompting', demand: 'High', available: 'Low', gapStatus: 'large' },
    { skill: 'Data structures', demand: 'Medium', available: 'High', gapStatus: 'covered' },
    { skill: 'Cloud (AWS)', demand: 'Very High', available: 'Medium', gapStatus: 'moderate' },
    { skill: 'Gen AI Integration', demand: 'High', available: 'Very Low', gapStatus: 'large' },
];

export const skillScores = [
    { id: 1, name: 'Python', score: 95 },
    { id: 2, name: 'SQL', score: 88 },
    { id: 3, name: 'React', score: 85 },
    { id: 4, name: 'Docker', score: 78 },
    { id: 5, name: 'Excel', score: 72 },
];

export const skillClusters = [
    {
        category: 'Data Science',
        skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Pandas'],
    },
    {
        category: 'Frontend Web',
        skills: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    },
    {
        category: 'Cloud DevOps',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    },
];

export const industrySkillData = [
    { name: 'Python', category: 'IT', value: 85 },
    { name: 'Medical Coding', category: 'Healthcare', value: 65 },
    { name: 'Marketing Analytics', category: 'Marketing', value: 75 },
    { name: 'Financial Modeling', category: 'Finance', value: 70 },
];
