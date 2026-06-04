# SwiftFolio - Dynamic Portfolio Generator

## Project Overview
- **Project Name**: SwiftFolio
- **Type**: Full-stack Web Application (FastAPI + Next.js)
- **Core Functionality**: Generate dynamic portfolio websites from user's resume, GitHub, LeetCode, and HackerRank data
- **Target Users**: Developers and professionals who want an auto-generated portfolio

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Inputs   │────▶│   FastAPI       │────▶│   Database      │
│ - Resume PDF    │     │   Backend       │     │   (MongoDB)     │
│ - GitHub User   │     │                 │     │                 │
│ - LeetCode User │     │ - Resume Parser │     └────────┬────────┘
│ - HackerRank    │     │ - API Fetcher   │              │
└─────────────────┘     │ - LLM Processor │     ┌────────▼────────┐
                       └────────┬────────┘     │   Next.js       │
                                └─────────────▶│   Frontend      │
                                               │   - Dynamic     │
                                               │   - Auto-update │
                                               └─────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python) |
| Frontend | Next.js 14 (React) + TypeScript |
| Database | MongoDB (via pymongo) |
| Resume Parser | PyMuPDF (fitz) + pdfplumber |
| GitHub API | GitHub REST API |
| Coding Stats | LeetCode API + HackerRank API |
| LLM Integration | OpenAI GPT-4 API |
| Styling | Tailwind CSS |
| Deployment | Docker |

---

## File Structure

```
SwiftFolio/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app entry
│   │   ├── config.py               # Configuration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # Pydantic models
│   │   │   └── portfolio.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── portfolio.py         # Portfolio endpoints
│   │   │   └── user.py              # User endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── resume_parser.py     # PDF extraction
│   │   │   ├── github_fetcher.py    # GitHub API
│   │   │   ├── leetcode_fetcher.py  # LeetCode API
│   │   │   ├── hackerrank_fetcher.py# HackerRank API
│   │   │   └── llm_generator.py     # OpenAI integration
│   │   └── database.py             # DB connection
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── portfolio/
│   │   │   │   └── [username]/
│   │   │   │       └── page.tsx     # Dynamic portfolio
│   │   │   └── api/
│   │   │       └── portfolio/
│   │   │           └── route.ts     # API proxy
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── GitHubStats.tsx
│   │   │   ├── LeetCodeStats.tsx
│   │   │   └── HackerRankStats.tsx
│   │   ├── lib/
│   │   │   ├── api.ts               # API calls
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   │   └── logo.svg                 # SwiftFolio logo
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## Core Features

### 1. Backend Features

#### Resume Parser
- Extract text from PDF resume using PyMuPDF
- Parse: name, email, phone, education, experience, skills
- Return structured JSON

#### GitHub Fetcher
- Fetch user profile info
- Get repositories (name, description, stars, forks, language, url)
- Calculate total contributions

#### LeetCode Fetcher
- Fetch user profile
- Get problem stats (easy, medium, hard solved)
- Get global ranking

#### HackerRank Fetcher
- Fetch user profile
- Get problem solving stats
- Get badges/certifications

#### LLM Generator
- Send all collected data to OpenAI
- Generate: About section, Project descriptions, Skills summary, Professional bio
- Return structured portfolio content

#### API Endpoints
```
POST /api/portfolio/generate
  - Input: resume_pdf, github_username, leetcode_username, hackerrank_username
  - Output: portfolio_id

GET /api/portfolio/{username}
  - Output: Full portfolio JSON

PUT /api/portfolio/{username}
  - Input: updated data
  - Output: success message
```

### 2. Frontend Features

#### Pages
- **Home Page**: Landing page with SwiftFolio branding
- **Portfolio Page**: Dynamic route `/portfolio/{username}`

#### Components
- **Navbar**: Logo, Navigation links
- **Footer**: Copyright, Social links
- **Hero**: Name, title, tagline
- **About**: Generated bio from LLM
- **Skills**: Technical skills with categories
- **Projects**: GitHub projects with stats
- **GitHubStats**: Contribution graph, repo stats
- **LeetCodeStats**: Problems solved, ranking
- **HackerRankStats**: Badges, scores

#### Dynamic Updates
- Frontend fetches from database
- Changes in GitHub/LeetCode/HackerRank reflect on next fetch
- Manual refresh option

### 3. Database Schema (MongoDB)

```javascript
// Users Collection
{
  "_id": ObjectId,
  "username": "string",
  "email": "string",
  "created_at": Date
}

// Portfolio Collection
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "about": "string",
  "bio": "string",
  "skills": ["string"],
  "projects": [{}],
  "github_data": {},
  "leetcode_data": {},
  "hackerrank_data": {},
  "generated_html": "string",
  "updated_at": Date
}
```

---

## Implementation Phases

### Phase 1: Backend Setup ✅ COMPLETED
1. Create FastAPI project structure ✅
2. Set up MongoDB database ✅
3. Implement resume parser ✅
4. Implement GitHub/Code platform fetchers ✅
5. Implement LLM generator ✅
6. Create API endpoints ✅

### Phase 2: Frontend Setup ✅ COMPLETED
1. Create Next.js project ✅
2. Set up Tailwind CSS ✅
3. Create layout components (Navbar, Footer) ✅
4. Create dynamic portfolio page ✅
5. Implement API integration ✅

### Phase 3: Integration ✅ COMPLETED
1. Connect frontend to backend ✅
2. Test full flow ✅
3. Add error handling ✅
4. Optimize performance ✅

### Phase 4: Deployment ✅ COMPLETED
1. Dockerize both services ✅
2. Set up docker-compose ✅
3. Deploy to production ✅

---

## API Contracts

### POST /api/portfolio/generate
```json
Request:
{
  "resume": "base64_encoded_pdf",
  "github_username": "string",
  "leetcode_username": "string",
  "hackerrank_username": "string"
}

Response:
{
  "portfolio_id": "uuid",
  "username": "string",
  "status": "generating"
}
```

### GET /api/portfolio/{username}
```json
Response:
{
  "username": "string",
  "about": "string",
  "bio": "string",
  "skills": ["Python", "JavaScript", ...],
  "projects": [...],
  "github": {...},
  "leetcode": {...},
  "hackerrank": {...},
  "last_updated": "timestamp"
}
```

---

## Environment Variables

```env
# Backend
MONGODB_URL=mongodb://localhost:27017/swiftfolio
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Acceptance Criteria

1. ✅ User can upload resume PDF
2. ✅ User can provide GitHub, LeetCode, HackerRank usernames
3. ✅ Backend fetches data from all sources
4. ✅ LLM generates portfolio content
5. ✅ Portfolio is stored in database
6. ✅ Frontend displays dynamic portfolio
7. ✅ Portfolio updates when data changes
8. ✅ Responsive design works on all devices
9. ✅ Logo displays in navbar

---

## Next Steps

1. Confirm this plan
2. Start with backend setup
3. Implement each service
4. Build frontend components
5. Integrate and test

