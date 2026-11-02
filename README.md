# CareerPilot AI

CareerPilot AI is a full-stack career planning workspace for students. It provides account registration, resume PDF text extraction and explainable skill matching, career exploration, Gemini-generated learning plans and interview practice, a career guidance chatbot with per-user conversation history, and saved progress in MongoDB.

## Stack

- React, Vite, React Router, Axios, Recharts, Lucide React
- Node.js, Express, Mongoose, MongoDB
- JWT authentication, bcrypt password hashing, request validation, rate limits, Helmet and Multer
- Google Gemini through the official `@google/genai` package (backend only)

## Requirements

- Node.js 20 or newer and npm
- MongoDB local instance or an Atlas connection string
- Optional Gemini API key for AI features

## Install and run

1. Copy `backend/.env.example` to `backend/.env` and configure MongoDB and a long random `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:5000/api`.
3. From the project root, install packages with `npm install`, `npm install --prefix backend`, and `npm install --prefix frontend`.
4. Run `npm run dev` at the root. The UI is served at `http://localhost:5173`; the API is at `http://localhost:5000`.
5. Or run the backend and frontend separately with `npm --prefix backend run dev` and `npm --prefix frontend run dev`.

Career records are initialized in MongoDB on the first `GET /api/careers` when the collection is empty. Set `GEMINI_API_KEY` in `backend/.env` to enable resume feedback, career recommendations, roadmap generation, interview coaching, and career chat. AI endpoints return a clear service-unavailable response when the key is absent; rule-based resume skill matching remains available.

### Initial admin setup

Set a one-time `ADMIN_SETUP_KEY` in the backend environment. Register the intended admin account through the normal registration flow, then send `POST /api/admin/setup` with `{ "email": "admin@example.com", "setupKey": "the-configured-key" }`. Remove or rotate the setup key after promotion. No public admin registration exists.

## Environment variables

Backend variables are documented in `backend/.env.example`: MongoDB URI, JWT signing secret and expiry, frontend origin, Gemini key and model, upload size, plus `ADMIN_SETUP_KEY` for initial promotion. The key is never sent to the browser. `frontend/.env.example` contains only the API base URL.

## Main API

All endpoints use the `/api` prefix. Authenticated endpoints require `Authorization: Bearer <token>`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | Create account or sign in |
| GET | `/auth/me` | Current account |
| GET | `/careers`, `/careers/:id` | Search and read careers |
| POST | `/resumes/upload` | Analyze PDF resume, optional `targetCareer` form field |
| GET | `/resumes/history`, `/resumes/:id` | User's saved analyses |
| POST | `/ai/analyze-skills` | Explainable rule-based skill comparison |
| POST | `/ai/resume-feedback`, `/ai/career-recommendations` | Gemini feedback and directions |
| GET | `/ai/chat/history`, `/ai/chat/history/:id` | List and read your saved career chats |
| POST | `/ai/chat` | Send a message to the Gemini career coach |
| POST/GET | `/roadmaps/generate`, `/roadmaps` | Generate and list plans |
| GET/PUT | `/roadmaps/:id` | Read or update task completion |
| POST | `/interviews/generate`, `/interviews/evaluate` | Interview practice and answer evaluation |
| GET | `/interviews/history` | Saved practice sessions |
| GET/PUT | `/progress` | Learning progress |
| GET | `/dashboard` | Student dashboard summary |
| GET | `/admin/students`, `/admin/analytics` | Admin-only activity views |
| POST | `/admin/setup` | Promote an existing account using setup key |
| GET | `/api/health` | API health check |

Career creation and editing are admin-only at `POST/PUT/DELETE /api/careers`.

## Build and deployment

This project includes complete configuration for deployment on [Render](https://render.com) using the included `render.yaml` Blueprint or standalone services.

- For step-by-step instructions on deploying to Render.com, see [DEPLOYMENT.md](file:///C:/Users/MG%20shreya/Desktop/MFEF%20Project/DEPLOYMENT.md).
- To build the frontend bundle: `npm run build`.
- To run unified production server: `npm start`.
- Deploy the frontend and API together (unified service) or separately, configure `MONGODB_URI`, `JWT_SECRET`, and optional `GEMINI_API_KEY`.

## Notes

Resume match is keyword detection against the selected career's required skills. It is not semantic AI scoring. Gemini feedback is generated on request and is not returned as a fabricated fallback. Practice scores are educational prompts, not hiring assessments. Salary and employment outcomes are not estimated.

## Verification

Run the backend unit checks with `npm test --prefix backend` and create the frontend production bundle with `npm run build --prefix frontend`. MongoDB-backed API flows require a configured database and are not covered by the local unit checks.
