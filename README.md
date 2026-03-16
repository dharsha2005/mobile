# Gadgetra Ecommerce (Electronics)

Monorepo containing a Next.js frontend and an Express/MongoDB backend for an electronic gadgets ecommerce store.

## Structure

- `backend`: Node.js + Express + MongoDB + JWT + Google OAuth + Cloudinary
- `frontend`: Next.js (App Router) + Bootstrap 5

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - Google OAuth keys
   - Cloudinary keys
4. `npm run dev`

API base URL (default): `http://localhost:5000/api`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Create `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. `npm run dev`

Frontend dev URL: `http://localhost:3000`

