# Job Prep AI

AI-powered job preparation platform that helps job seekers 
identify skill gaps, extract resume skills, and generate 
personalized interview questions.

## Live Demo
🔗 https://job-prep-ai-mu.vercel.app/

## Tech Stack
- Frontend: React, TypeScript, Vite, TailwindCSS, TanStack Query, Zustand
- Backend: Node.js, Express, TypeScript, MongoDB, JWT
- AI: Google Gemini 1.5 Flash
- Deployed: Vercel + Render

## Features
- Resume upload and parsing (PDF/DOCX)
- AI skill extraction with MongoDB caching
- Skill gap analysis with match score
- AI interview question generation
- Improvement suggestions with learning resources
- Dashboard with progress tracking

## Architecture
Routes → Controllers → Services → MongoDB
