# ApexDev-Backend

Backend for **ApexDev** — a job scam detection platform built to solve the problem statement *"The Fake Job Offer"* (Cybersecurity domain). The goal is to help job seekers verify companies and job offers before they fall victim to scams.

> Built as a hands-on MERN (backend-heavy) learning project — every module is added incrementally with a focus on real-world backend concepts: auth, security, database relationships, and eventually AI-based scam analysis.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose 9
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Security:** Helmet, express-rate-limit
- **Environment Config:** dotenv
- **Dev Tooling:** nodemon
- **AI (planned):** Google Gemini (`@google/genai`) for scam-signal analysis of job offers

---

## Project Structure

```
ApexDev-Backend/
├── controllers/     # Business logic (auth, company, job, etc.)
├── middleware/      # Auth protection, role-based access, error handling
├── models/          # Mongoose schemas (User, Company, JobOffer, ...)
├── routes/          # Express routers, mounted in SERVER.JS
├── utils/           # Helpers (async handler, error handler, email/OTP, etc.)
├── .gitignore
├── package.json
└── SERVER.JS        # App entry point
```

---

## Features

### ✅ Implemented

- **Authentication**
  - User registration & login with hashed passwords (bcrypt pre-save hook)
  - JWT-based session auth with a `protect` middleware
  - Role-based access via a higher-order `authorize` middleware
  - User roles: `jobSeeker`, `recruiter`, `admin`
- **Company Verification**
  - Company model — name, registration number, website, verification status, trust score, linked to the user who added it
  - Create / list / get-by-id endpoints
- **Job Offers**
  - JobOffer model — title, description, salary, location, upfront-fee flag, linked Company and postedBy user, scam score
  - Create / list / get-by-id endpoints (with `.populate()` for related Company & User data)
- **Centralized Error Handling**
  - `asyncHandler` wrapper + custom `ErrorHandler` + global error middleware
- **Email/OTP Integration** — for verification flows

### 🚧 Planned

- Rule-based scam detection engine (`utils/scamDetector.js`)
- Gemini AI chatbot to analyze job offers for scam red flags
- Community reports & reviews on companies/offers
- File uploads (Multer/Cloudinary) for scam evidence/screenshots
- Testing suite (Jest + Supertest)
- React frontend (completing the MERN stack)
- Deployment (Render/Railway + Vercel) with CDN & load balancing
- Input validation (express-validator/zod), request logging (winston/morgan), pagination, Redis caching

---

## API Endpoints (so far)

| Base Path         | Description                          |
|--------------------|---------------------------------------|
| `/api/auth`        | Register, login                      |
| `/api/companies`   | Create/view companies                |
| `/api/jobs`         | Create/view job offers               |

*(Full endpoint-level docs will be added as the project grows.)*

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (or a connection URI)

### Installation

```bash
git clone https://github.com/prakharsrivcodes/ApexDev-Backend.git
cd ApexDev-Backend
npm install
```

### Environment Variables

Create a `.env` file in the root with values like:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the server

```bash
npm run dev
```

---

## Roadmap

This project is being built step by step as a learning exercise, with an emphasis on backend depth: database transactions, API design principles, auth sessions/cookies, caching, distributed systems basics, deployment, load balancing, and security — alongside AI/LLM integration (Gemini API, RAG-style analysis, guardrails).

---

## Author

**Prakhar Srivastava** ([@prakharsrivcodes](https://github.com/prakharsrivcodes))
