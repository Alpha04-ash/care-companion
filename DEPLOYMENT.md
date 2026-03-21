# CareCompanion Deployment Guide

This project is optimized for deployment on **Vercel**.

## Environment Variables
Ensure the following variables are set in your deployment environment (Vercel Dashboard):

- `GEMINI_API_KEY`: Your Google AI Studio API key.

## Local Configuration
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env.local` file with your `GEMINI_API_KEY`.
4. Run `npm run dev`.

## Build Verification
To ensure a perfect deployment, run:
```bash
npm run build
```
This will verify all TypeScript types and Next.js routes.

## Deployment Steps
1. Push your code to GitHub.
2. Connect the repository to Vercel.
3. Add the Environment Variable.
4. Deploy!
