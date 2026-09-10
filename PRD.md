# OneGuide India Implementation Plan

This document outlines the architecture and phased implementation plan for OneGuide India, a centralized government-service guidance platform.

## User Review Required

> [!IMPORTANT]
> Please review the proposed technology stack and project structure before we begin.
> **Database:** I will set up the Mongoose schemas. You mentioned using MongoDB Atlas. During the backend setup phase, you will need to provide a MongoDB connection string (URI) in the `.env` file, or I can set it up to use a local MongoDB instance for development if you prefer. 

## Open Questions

> [!WARNING]
> 1. **Authentication Strategy:** You mentioned JWT should not be stored in localStorage. I will implement HttpOnly secure cookies for storing the JWT access tokens. Is this acceptable?
> 2. **Monorepo vs. Separate Repositories:** I plan to structure this as a single repository with two main folders: `client` (Frontend) and `server` (Backend). This is typically easier for development. Does this work for you?
> 3. **Database Environment:** Would you like to start with a local MongoDB instance for initial development, or do you already have a MongoDB Atlas cluster ready to use?

## Proposed Architecture

### Tech Stack
*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, React Router v6, TanStack Query v5, React Hook Form, Zod, Lucide React, i18next (for multilingual support).
*   **Backend:** Node.js, Express, TypeScript, Mongoose.
*   **Database:** MongoDB.
*   **Security:** bcrypt/argon2id (password hashing), jsonwebtoken, cookie-parser (for HttpOnly cookies), helmet, cors, express-rate-limit.

### Project Structure
```text
OneGuide-india/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── assets/         # Images, fonts
│   │   ├── components/     # Reusable UI components (Shadcn UI, etc.)
│   │   ├── features/       # Feature-based modules (auth, services, profile)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── i18n/           # Multilingual configuration (En, Hi, Gu)
│   │   ├── layouts/        # Page layouts (Navbar, Footer, AdminLayout)
│   │   ├── pages/          # Route components (Home, ServiceDetail, Admin)
│   │   ├── services/       # API calling logic (axios/fetch wrappers)
│   │   ├── store/          # Global state (if necessary)
│   │   ├── types/          # TypeScript interfaces/types
│   │   └── utils/          # Helper functions
│   └── ...
├── server/                 # Backend Express Application
│   ├── src/
│   │   ├── config/         # Environment variables, DB connection
│   │   ├── controllers/    # Request handling logic
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Core business logic (Recommendation Engine)
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── ...
└── README.md
```

## Proposed Changes

We will execute this project in phases:

### Phase 1: Project Initialization & Foundation
*   Initialize the `client` React/Vite/TS project.
*   Install and configure Tailwind CSS and initialize Shadcn UI.
*   Initialize the `server` Node/Express/TS project.
*   Set up ESLint, Prettier, and TypeScript configurations for both.
*   Set up basic Express server and MongoDB connection logic.

### Phase 2: Database Schemas & Backend Authentication
*   Define Mongoose schemas (`User`, `Service`, `Category`, `Helpline`).
*   Implement Authentication API (`/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/me`).
*   Implement secure JWT handling using HttpOnly cookies.
*   Implement admin role middleware.

### Phase 3: Core API Endpoints & Admin Management
*   Develop CRUD endpoints for Services, Categories, and Helplines.
*   Implement search and filtering logic for Services.
*   Develop the Recommendation Engine scoring logic based on user profile attributes.

### Phase 4: Frontend Core & Authentication
*   Setup React Router and layout structure (Header, Footer).
*   Implement i18next for English, Hindi, and Gujarati.
*   Build authentication pages (Login, Register) and connect to the backend.
*   Implement TanStack query for data fetching.

### Phase 5: Frontend User Features
*   Build the Homepage with search and category navigation.
*   Build the "Find Schemes for You" multi-step questionnaire.
*   Build the Service Detail page with the structured information architecture.
*   Implement user profile and saved services functionality.

### Phase 6: Admin Dashboard & Seed Data
*   Build the Admin interface for content management (creating/editing services).
*   Create a robust seed script to populate the database with realistic initial data (schemes, jobs, scholarships).

## Verification Plan

### Automated Tests
*   We will ensure the backend compiles and endpoints return correct statuses using a tool like Bruno or Postman.
*   Frontend routing and components will be tested by starting the dev server.

### Manual Verification
*   We will manually verify the authentication flow (register, login, session persistence via HttpOnly cookie).
*   We will run through the "Find Schemes for You" questionnaire to verify the recommendation engine.
*   We will verify the language switcher updates the UI text appropriately.
