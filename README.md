# URUGENDO (The Journey)

> A modern bilingual online learning platform dedicated to teaching Rwandan traffic rules (*Amategeko y'Umuhanda*), road signs, and road safety to prepare learners for the provisional driving license examination.

---

## Architecture Overview

```text
urugendo/
│
├── client/                      # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── public/                  # Static assets & web manifest
│   ├── src/
│   │   ├── assets/              # Brand icons & imagery
│   │   ├── components/          # Modular UI components
│   │   │   ├── navbar/          # Fixed blur navigation & mobile drawer
│   │   │   ├── hero/            # Ken Burns slideshow with slide indicators
│   │   │   ├── sections/        # Marquee, WhoWeAre, WhatWeOffer, FeatureHighlight, CTA
│   │   │   ├── testimonials/    # Learner reviews & ratings
│   │   │   ├── faq/             # Interactive accordion
│   │   │   ├── footer/          # Comprehensive links, contacts, bilingual switcher
│   │   │   └── auth/            # Auth modal with Register / Login tab toggles
│   │   ├── layouts/             # MainLayout with header, outlet, footer
│   │   ├── pages/               # Home, Login, Register, NotFound
│   │   ├── routes/              # AppRoutes configuring current & future paths
│   │   ├── context/             # ThemeContext, LanguageContext, AuthModalContext
│   │   ├── data/                # Static datasets & bilingual translations (EN/RW)
│   │   ├── App.jsx              # Root component with providers
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind + custom animations & design tokens
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                      # Node.js + Express.js API Foundation
│   ├── src/
│   │   ├── config/              # MongoDB connection & environment settings
│   │   ├── controllers/         # Auth, course, sign, exam, payment handlers
│   │   ├── middleware/          # Security, auth, and error handling
│   │   ├── models/              # Mongoose schemas (User, Course, Lesson, Sign, Exam, Payment)
│   │   ├── routes/              # Modular Express route handlers
│   │   └── server.js            # Express application bootstrap
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## Technology Stack

### Frontend
- **React**: Modern functional components with hooks.
- **Vite**: Fast development server and optimized build tool.
- **Tailwind CSS**: Utility-first styling with custom `brand` and `ink` palettes.
- **Framer Motion**: Smooth motion and UI state transitions.
- **React Router**: Client-side routing with deep link and 404 support.
- **Lucide React**: Clean SVG iconography.

### Backend (Architecture Prepared)
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js**: Fast, minimalist REST API server.
- **MongoDB & Mongoose**: Object modeling for users, lessons, road signs, exams, and payments.
- **Helmet, CORS, Morgan**: Production-grade HTTP security and logging.

---

## Quick Start

### 1. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

To build for production:

```bash
npm run build
```

### 2. Backend Foundation

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API will listen at [http://localhost:5000](http://localhost:5000) (Health check: `/api/health`).

---

## Platform Features in Phase 1

- **Design Preservation**: Exact replication of typography, colors, animations, cards, and responsive behavior from the original HTML design.
- **Dark Mode**: Persisted light/dark theme toggle matching system preference and user choice.
- **Bilingual Engine**: English (`en`) and Kinyarwanda (`rw`) language toggling across hero, services, about, approach, testimonials, and footer.
- **Interactive Slideshow**: 5-slide visual carousel with smooth Ken Burns zoom effect and active indicators.
- **Interactive Accordion**: FAQ section with smooth expand/collapse transitions.
- **Responsive Mobile Navigation**: Touch-friendly slide-in drawer menu.
- **Authentication Interface**: Accessible modal and dedicated pages (`/login`, `/register`) with tab switching and client-side form validation.
- **Scalable Architecture**: Modular file structure ready for paid subscription gates, mock exams, and learner dashboards.
