# How to run locally (quick steps)

1. Start MongoDB (local or Atlas). Set `MONGO_URI` in `backend/.env`.
2. Backend:
   ```bash
   cd backend
   cp .env.example .env
   # edit .env to set MONGO_URI and JWT_SECRET
   npm install
   npm run dev
