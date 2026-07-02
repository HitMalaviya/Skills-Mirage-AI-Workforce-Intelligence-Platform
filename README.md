# Skills Mirage - AI Workforce Intelligence Platform

Skills Mirage is a full-stack, AI-powered workforce intelligence platform designed to analyze job market trends, skill demands, and automation risks. It provides actionable insights for professionals and organizations to navigate the evolving job landscape driven by Artificial Intelligence.

## 🌟 Key Features

- **📊 Dashboard & Hiring Trends:** Visualize job volume over time, sector distribution, and geographic hiring heatmaps across India using interactive charts and maps.
- **🧠 Skills Intelligence:** Track rising vs. declining skills, skill evolution timelines, and skill gap analyses to stay ahead of market demands.
- **⚠️ AI Vulnerability Index:** Monitor automation risks for specific roles and explore safe career transitions with interactive vulnerability heatmaps.
- **🛡️ Personal Risk Analysis:** Calculate your personal risk score against AI automation and generate tailored transition plans.
- **👤 Worker Career Profile:** AI-driven profile analysis based on experience, current role, and location.
- **🛣️ Career Transition Roadmap:** Generate personalized, AI-powered learning plans and course recommendations for upskilling.
- **💬 AI Career Chat:** Real-time conversational AI guide (powered by Groq) to answer career-related queries in multiple languages.

## 🛠️ Technology Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Data Visualization:** Chart.js, Recharts, React-Leaflet, React-Simple-Maps
- **Backend & APIs:** Next.js API Routes, Groq SDK for AI Chat, AI APIs
- **Authentication & Database:** Firebase, Supabase

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm
- API Keys for Supabase, Firebase, and Groq/AI providers

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HitMalaviya/Skills-Mirage-AI-Workforce-Intelligence-Platform.git
   cd Skills-Mirage-AI-Workforce-Intelligence-Platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your API keys. Without these keys, AI features (like Profile Analysis, Roadmap Generation, and Chat) will not function correctly.
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   # Add your Supabase, Groq, and other required API keys here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/src/app`: Contains all Next.js pages and API routes (e.g., `/api/chat`, `/api/analyze`, `/api/reskilling`).
- `/src/components`: Reusable UI components including layout elements (Header, Sidebar) and custom charts/maps.
- `/src/data`: Static mock data for trends, hiring, and risks.
- `/src/hooks`: Custom React hooks (like `useMarketData`) for data fetching and state management.
- `/src/lib`: Configuration and initialization files for external services (Firebase, Supabase).
- `/src/context`: React Context providers for global state (e.g., AuthContext).

## 🐛 Troubleshooting & Known Issues

- **AI Features failing (500 Error):** If the Career Chat, Worker Profile Analysis, or Reskilling Roadmap generation fails, it means your AI API keys (like Groq) are either missing or invalid in the `.env.local` file. 

---
*Built to empower the future workforce.*
