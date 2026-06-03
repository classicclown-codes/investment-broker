# Investment Broker - Local Dev

Run locally (Node 18+ recommended):

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Authentication:
- Supabase Auth powers email/password signup and login
- Copy `.env.example` to `.env.local` and set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_ADMIN_EMAILS` (comma-separated admin email addresses)
- Admin access is granted when `user_metadata.role` is `admin`, or when the user email matches `VITE_ADMIN_EMAILS`

Database setup:
- Run `supabase-schema.sql` in the Supabase SQL editor to create the required tables

Deployment to Vercel:
- A `vercel.json` config file is included for static build and API routes
- Run `vercel deploy` to publish the site

App routes:
- `/` - Landing
- `/login` - Auth page
- `/signup` - Client account creation
- `/apply` - Protected onboarding form
- `/dashboard` - Protected investor dashboard

Production readiness:
- Tailwind CSS built via PostCSS
- Vite production build configured in `vite.config.js`
- Supabase client auth and protected routes included
- Vercel deployment config added
- Onboarding submissions still need a persistent backend table or workflow
