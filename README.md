# WeVibe

AI-Powered Roommate Matching Platform

**weVibe** is a full-stack web application that helps users find compatible roommates based on lifestyle preferences, communication styles, and social energy levels. It features AI-powered matching, real-time chat, and premium feature gating — all built with modern full-stack technologies.

---

## 🔗 Live Demo

👉 [we-vibe-green.vercel.app](https://we-vibe-green.vercel.app/auth/sign-in)

---

## 🚀 Features

- 🔐 Secure authentication (NextAuth with OAuth + credentials)
- 🧭 Multi-step onboarding to collect user lifestyle traits
- 🤖 AI-based roommate matching using Together API
- 💬 Real-time chat system using Socket.IO
- 📤 Match request system with acceptance workflow
- 🎯 Role-based access (User, Admin)
- 💎 Premium feature gating (upgrade prompt, access control)
- 📊 Admin dashboard with user and match stats

---

## 🏗️ Tech Stack

| Layer       | Tech Used                                     |
|-------------|-----------------------------------------------|
| Frontend    | Next.js 15 (App Router), Tailwind, ShadCN UI  |
| Backend     | Prisma ORM, MongoDB, NextAuth v5              |
| Realtime    | Socket.IO (chat)                              |
| AI Matching | Together AI API                               |
| DevOps      | Vercel (Frontend), Railway (Backend), GitHub CI/CD |

---

## 🧩 Features

- 🔐 **Auth**: OAuth + Credentials via NextAuth
- 🧠 **AI Matching**: Lifestyle-based scoring via LLM
- 🧭 **Onboarding**: Multi-step onboarding flow
- 💬 **Chat**: Real-time messaging via Socket.IO
- 👥 **Match Requests**: Send, accept, and track
- 💎 **Premium Gating**: Feature access tied to roles
- 🧑‍💼 **Admin Dashboard**: Role-restricted insights

---

## 🔒 Security

- Passwords securely hashed via bcrypt

- JWT-based session handling via NextAuth

- Middleware-based route protection (middleware.ts)

- Admin and premium access control via role and isPremium attributes

- Sensitive values managed with .env and Vercel/Railway secrets

---

## 💳 Payments (MVP Mode)

- Premium user gating based on isPremium flag in the database

- Stripe integration is scaffolded but not yet active

- Upgrade button simulates checkout flow for testing

- Stripe test mode + webhook access control planned for production

---

## 📊 Admin Dashboard

- Access restricted via role === "Admin" on the server

- Displays key metrics: total users, premium subscribers, and match counts

- Built with modular, reusable dashboard components

- Route-based protection using layout + server auth validation

---

## 🧠 AI Matching

- Uses onboarding data: cleanliness, sleep schedule, social energy, etc.

- Pre-filters matches based on user-defined preferences

- Sends formatted prompt to Together AI for compatibility scoring

- Returns and renders top matches ranked by compatibility

---

## 💬 Real-Time Chat

- Built with Socket.IO for instant messaging

- Deployed via Railway (to bypass Vercel’s serverless socket limitations)

- Chat messages sent and received in real time

- Fallback message rendering via Prisma for persistence across reloads

---


