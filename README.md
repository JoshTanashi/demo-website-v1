# Prince Platform

A community-driven property rating platform for South African residential complexes. Residents rate their complex across 6 dimensions, giving prospective tenants and buyers real data to make informed decisions.

## Features

- **Interactive map** — Mapbox GL JS with colour-coded score markers across South Africa
- **6-dimension ratings** — Safety & Security, Cleanliness, Modernity, Utilities, Body Corporate, Value for Money
- **Community chat** — live discussion panel for property talk
- **Prince AI** — chatbot assistant for property questions
- **Auth & ratings** — sign up, sign in, and submit verified reviews via Supabase
- **Responsive** — full desktop layout with collapsible drawers, mobile layout with bottom nav and sheets

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 |
| Map | Mapbox GL JS v3.6.0 (CDN) |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Fonts | IBM Plex Sans / IBM Plex Mono |

## Getting Started

### 1. Clone

```bash
git clone https://github.com/JoshTanashi/demo-website-v1.git
cd demo-website-v1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the project root:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Build for production

```bash
npm run build
```

## Database Schema

```sql
-- Places
create table places (
  place_id uuid primary key default gen_random_uuid(),
  name text not null,
  suburb text,
  city text,
  lat numeric,
  lng numeric,
  type text,
  description text
);

-- Ratings (one per user per place)
create table ratings (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(place_id),
  user_id uuid references auth.users(id),
  safety_security numeric check (safety_security between 1 and 5),
  cleanliness_upkeep numeric check (cleanliness_upkeep between 1 and 5),
  newness_modernity numeric check (newness_modernity between 1 and 5),
  utilities_reliability numeric check (utilities_reliability between 1 and 5),
  body_corporate_financials numeric check (body_corporate_financials between 1 and 5),
  value_for_money numeric check (value_for_money between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique(place_id, user_id)
);

-- Aggregates view
create view place_aggregates as
select
  p.*,
  count(r.id) as review_count,
  avg(r.safety_security) as avg_safety_security,
  avg(r.cleanliness_upkeep) as avg_cleanliness_upkeep,
  avg(r.newness_modernity) as avg_newness_modernity,
  avg(r.utilities_reliability) as avg_utilities_reliability,
  avg(r.body_corporate_financials) as avg_body_corporate_financials,
  avg(r.value_for_money) as avg_value_for_money,
  (
    avg(r.safety_security) + avg(r.cleanliness_upkeep) + avg(r.newness_modernity) +
    avg(r.utilities_reliability) + avg(r.body_corporate_financials) + avg(r.value_for_money)
  ) / 6 as avg_overall,
  max(r.created_at) as last_rated_at
from places p
left join ratings r on r.place_id = p.place_id
group by p.place_id;
```

## Project Structure

```
src/
├── App.jsx                 # Root layout (desktop + mobile)
├── index.css               # Design system (tokens, glassmorphism, animations)
├── main.jsx
├── components/
│   ├── Map.jsx             # Mapbox GL map with bubble markers
│   ├── Rail.jsx            # Left drawer — property list + filters
│   ├── Drawer.jsx          # Right drawer — place details + score breakdown
│   ├── Auth.jsx            # Sign in / sign up modal
│   ├── RateForm.jsx        # Rating submission modal
│   ├── WorldChat.jsx       # Community chat panel
│   ├── ChatBot.jsx         # AI assistant panel
│   ├── Toast.jsx           # Toast notifications
│   └── ErrorBoundary.jsx   # React error boundary
├── hooks/
│   ├── usePlaces.js        # Loads place_aggregates from Supabase
│   └── useAuth.js          # Supabase auth state
└── lib/
    ├── config.js           # Mapbox token, map centre, rating dimensions
    └── supabase.js         # Supabase client
```

## License

MIT
