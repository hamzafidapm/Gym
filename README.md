<h1 align="center">🏋️ Ironhaus</h1>
<p align="center">A gym booking application with real-time scheduling — built with Next.js, Neon Postgres, and Prisma.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Postgres-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
</p>

<!-- 📸 Add a screenshot or GIF of the booking calendar here -->
<!-- ![Ironhaus Screenshot](./screenshot.png) -->

---

## 🚀 Live Demo
🔗 [ironhaus.vercel.app](https://ironhaus.vercel.app)

---

## ✨ Features

- 📅 Real-time class/session booking and scheduling
- 🔐 User authentication via NextAuth.js (Auth.js), email + password
- 🏋️ Browse available gym sessions and trainers
- 📱 Responsive design for booking on the go

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database | Neon (serverless Postgres) via Prisma |
| Auth | NextAuth.js (Auth.js) — Credentials provider, bcrypt, JWT sessions |
| Deployment | Vercel |

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/hamzafidapm/Gym.git
cd Gym/web

# Install dependencies (also generates the Prisma client)
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL (your Neon connection string) and AUTH_SECRET

# Push the schema to your database and seed the class schedule
npm run db:push
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

---

## 🔑 Environment Variables

```env
DATABASE_URL=
AUTH_SECRET=
```

Neither is `NEXT_PUBLIC_`-prefixed — both are server-only and never reach the
browser bundle. See `web/PRISMA.md` for the full setup, including how
schema sync runs as part of the Vercel build.

---

## 📄 License

This project is for portfolio purposes.

---

<p align="center">Built by <a href="https://instagram.com/vibewith.hamzah">Hamza Fida</a> — Full-stack developer</p>
