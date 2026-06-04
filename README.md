# SwiftFolio
SwiftFolio is an AI-powered portfolio generator that turns GitHub, LeetCode, HackerRank, and resume data into a sleek, animated personal website in minutes. It features modern templates, responsive design, GitHub profile integration, and automated content generation for a polished developer portfolio.
# 🚀 SwiftFolio

![SwiftFolio Demo](docs/demo.gif)

**Smart, AI-powered developer portfolios generated from your resume and coding profiles.**

SwiftFolio automatically creates beautiful, editable portfolio websites by combining your resume, GitHub repositories, coding achievements, and AI-generated content into a polished professional portfolio.

---

## 📖 Table of Contents

* [About](#about)
* [Problem Statement](#problem-statement)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Quick Start](#quick-start)
* [Environment Variables](#environment-variables)
* [API Endpoints](#api-endpoints)
* [Project Structure](#project-structure)
* [What's New](#whats-new)
* [License](#license)

---

## 📌 About

Building a professional portfolio often requires collecting information from multiple platforms, writing descriptions, organizing projects, and designing a presentable layout.

**SwiftFolio** automates this entire process by:

* Parsing resume content
* Fetching coding profile statistics
* Generating professional portfolio content using AI
* Supporting multilingual portfolios
* Exporting complete portfolios as shareable HTML websites

Generate a professional developer portfolio in minutes instead of hours.

---

## ❗ Problem Statement

### Challenges Developers Face

* Creating a portfolio is time-consuming
* Project descriptions must be written manually
* Information is scattered across GitHub, LeetCode, HackerRank, and resumes
* Maintaining consistency in design and content is difficult
* Sharing portfolios in multiple languages requires additional effort

### SwiftFolio Solution

SwiftFolio consolidates information from multiple sources and automatically generates a polished portfolio website with minimal user input.

---

## ✨ Features

### 📄 Resume Upload & Parsing

* Upload PDF resumes
* Extract skills, experience, education, and achievements
* Automatically populate portfolio sections

### 🖥️ GitHub Integration

* Display repositories and contributions
* Showcase top projects
* Highlight stars and coding activity

### 🏆 Coding Profile Statistics

* LeetCode problem-solving statistics
* HackerRank achievements
* Coding profile summaries

### 🤖 AI-Powered Content Generation

Generate:

* About Me section
* Professional Bio
* Skills Summary
* Project Descriptions
* Portfolio Highlights

### ✏️ Portfolio Editing

Modify generated content anytime:

* About section
* Bio
* Skills
* Projects
* Languages

### 🌍 Multi-Language Support

* Translate portfolios into supported languages
* Reach a global audience

### 📦 Export & Sharing

* Download original resume
* Export portfolio as HTML
* Share portfolio instantly

### 🔄 Dynamic Updates

* Refresh portfolio data when coding profiles change
* Keep information up to date

---

## 🛠️ Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Frontend   | Next.js 14 + TypeScript |
| Backend    | FastAPI (Python)        |
| Database   | MongoDB                 |
| Styling    | Tailwind CSS            |
| AI         | OpenAI API              |
| Deployment | Docker & Docker Compose |

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/SwiftFolio.git
cd SwiftFolio
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials.

### 3. Run Using Docker

```bash
docker-compose up --build
```

### 4. Access the Application

| Service           | URL                        |
| ----------------- | -------------------------- |
| Frontend          | http://localhost:3000      |
| Backend API       | http://localhost:8000      |
| API Documentation | http://localhost:8000/docs |

---

## 💻 Local Development

### Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate      # Linux/Mac
# .venv\Scripts\activate       # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file and configure the following:

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| MONGODB_URL    | MongoDB connection string               |
| DATABASE_NAME  | Database name                           |
| OPENAI_API_KEY | OpenAI API key (optional)               |
| GITHUB_TOKEN   | GitHub Personal Access Token (optional) |

Example:

```env
MONGODB_URL=mongodb://mongo:27017
DATABASE_NAME=swiftfolio
OPENAI_API_KEY=your_api_key
GITHUB_TOKEN=your_github_token
```

---

## 🔗 API Endpoints

### Generate Portfolio

```http
POST /api/portfolio/generate
```

### Get Portfolio

```http
GET /api/portfolio/{username}
```

### Get Latest Portfolio

```http
GET /api/portfolio/latest
```

### Available Languages

```http
GET /api/portfolio/languages/available
```

### Edit Portfolio

```http
PATCH /api/portfolio/{username}/edit
```

### Translate Portfolio

```http
POST /api/portfolio/{username}/translate/{language}
```

### Download Resume

```http
GET /api/portfolio/{username}/resume/download
```

### Export Portfolio as HTML

```http
GET /api/portfolio/{username}/export/html
```

### Refresh Portfolio

```http
POST /api/portfolio/{username}/refresh
```

### Update Portfolio

```http
PUT /api/portfolio/{username}
```

### Delete Portfolio

```http
DELETE /api/portfolio/{username}
```

---

## 📂 Project Structure

```text
SwiftFolio/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🆕 What's New

* Portfolio editing support
* Multi-language translation
* Resume download functionality
* HTML portfolio export
* Dynamic portfolio refresh
* Improved API endpoints
* Stable export payloads

---

## 🎯 Key Benefits

* Save hours of manual portfolio creation
* Aggregate data from multiple coding platforms
* Generate professional AI-written content
* Export and share instantly
* Customize and update anytime
* Deploy easily using Docker

---

## 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute it for personal or commercial projects.

---

## ⭐ Support

If you find SwiftFolio useful, consider giving the repository a **star** on GitHub.

Contributions, suggestions, and feedback are always welcome!
