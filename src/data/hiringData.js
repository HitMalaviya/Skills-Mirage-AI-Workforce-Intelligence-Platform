export const jobVolumeData = [
  { name: 'Week 1', jobs: 4000 },
  { name: 'Week 2', jobs: 3000 },
  { name: 'Week 3', jobs: 2000 },
  { name: 'Week 4', jobs: 2780 },
  { name: 'Week 5', jobs: 1890 },
  { name: 'Week 6', jobs: 2390 },
  { name: 'Week 7', jobs: 3490 },
];

export const categoryTrendData = [
  { name: 'Software Dev', current: 12000, previous: 10500 },
  { name: 'Data Science', current: 8500, previous: 7200 },
  { name: 'Customer Support', current: 5000, previous: 6200 },
  { name: 'Marketing', current: 4200, previous: 4000 },
  { name: 'Finance', current: 3800, previous: 3500 },
];

export const cityHiringData = [
  { name: 'Bangalore', value: 92 },
  { name: 'Pune', value: 85 },
  { name: 'Hyderabad', value: 82 },
  { name: 'Chennai', value: 75 },
  { name: 'Mumbai', value: 70 },
  { name: 'Gurgaon', value: 68 },
  { name: 'Noida', value: 65 },
  { name: 'Indore', value: 63 },
  { name: 'Coimbatore', value: 58 },
  { name: 'Ahmedabad', value: 55 },
  { name: 'Kochi', value: 52 },
  { name: 'Kolkata', value: 50 },
  { name: 'Jaipur', value: 45 },
  { name: 'Trivandrum', value: 40 },
  { name: 'Chandigarh', value: 38 },
  { name: 'Surat', value: 35 },
  { name: 'Lucknow', value: 30 },
  { name: 'Nagpur', value: 28 },
  { name: 'Bhopal', value: 25 },
  { name: 'Patna', value: 20 },
].sort((a, b) => b.value - a.value);

export const sectorData = [
  { name: 'IT', value: 45 },
  { name: 'Finance', value: 20 },
  { name: 'Healthcare', value: 15 },
  { name: 'BPO/Support', value: 10 },
  { name: 'Retail', value: 10 },
];

export const topCompanies = [
  { id: 1, name: 'Infosys', jobs: 1250, sector: 'IT' },
  { id: 2, name: 'TCS', jobs: 1100, sector: 'IT' },
  { id: 3, name: 'Accenture', jobs: 950, sector: 'IT' },
  { id: 4, name: 'Amazon', jobs: 820, sector: 'E-commerce' },
  { id: 5, name: 'HDFC Bank', jobs: 640, sector: 'Finance' },
];

export const emergingRoles = [
  { id: 1, title: 'AI Prompt Engineer', tags: ['Emerging Role', 'High Demand'] },
  { id: 2, title: 'AI Content Moderator', tags: ['Emerging Role', 'Steady Growth'] },
  { id: 3, title: 'Generative AI Developer', tags: ['High Demand', 'Premium Salary'] },
  { id: 4, title: 'Cybersecurity Analyst', tags: ['Critical Need', 'Deficit'] },
];

export const growthIndicators = [
  { category: 'Data Science', change: '+22%', isPositive: true },
  { category: 'Software Development', change: '+12%', isPositive: true },
  { category: 'Customer Support', change: '-15%', isPositive: false },
  { category: 'Data Entry', change: '-28%', isPositive: false },
];
