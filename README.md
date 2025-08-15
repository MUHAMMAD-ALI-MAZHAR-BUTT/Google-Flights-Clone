# ✈️ Google Flights Clone

A Google Flights–style flight search interface built with **React**, **TypeScript**, **Tailwind CSS**, and **CSS Modules**.

![Preview](./src/assets/images/preview.png)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Clone & Run](#clone--run)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Directory Overview](#directory-overview)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- CSS Modules
- React Router
- Framer Motion, Lucide React

## Clone & Run

```bash
# 1) Clone
git clone https://github.com/MUHAMMAD-ALI-MAZHAR-BUTT/Google-Flights-Clone.git
cd Google-Flights-Clone

# 2) Install dependencies
npm install

# 3) Start the dev server
npm run dev
```

**Build & Preview**

```bash
npm run build
npm run preview
```

## Scripts

- `dev` — Start Vite development server
- `build` — Build for production
- `preview` — Preview the production build locally

## Project Structure

```text
.
├── package-lock.json
├── package.json
├── postcss.config.js
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── icons
│   │   └── images
│   │       ├── favicon.png
│   │       └── preview.png
│   ├── components
│   │   ├── common
│   │   │   ├── Button
│   │   │   ├── DatePicker
│   │   │   ├── Dropdown
│   │   │   ├── Header
│   │   │   ├── Input
│   │   │   ├── Loading
│   │   │   ├── Modal
│   │   │   └── Success
│   │   ├── flights
│   │   │   ├── FlightCard
│   │   │   ├── FlightFilters
│   │   │   └── FlightList
│   │   ├── modals
│   │   │   ├── CalendarModal
│   │   │   └── PassengerModal
│   │   └── search
│   │       ├── AirportSelect
│   │       └── SearchForm
│   ├── contexts
│   │   └── ThemeContext.tsx
│   ├── declarations.d.ts
│   ├── hooks
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   └── Home.tsx
│   ├── services
│   │   └── api.ts
│   ├── styles
│   │   ├── blob-animation.css
│   │   └── globals.css
│   ├── types
│   │   └── index.ts
│   ├── utils
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration

**Path Aliases**

- Imports like `@/contexts/ThemeContext` resolve to `src/`.
- `vite.config.ts`:

  ```ts
  import { resolve } from "path";

  export default {
    resolve: {
      alias: { "@": resolve(__dirname, "src") },
    },
  };
  ```

**Tailwind CSS**

- Global styles: `src/styles/globals.css`
- Animations: `src/styles/blob-animation.css`
- Config: `tailwind.config.js`
- PostCSS: `postcss.config.js`

**CSS Modules**

- Component-scoped styles via `*.module.css`
- Type declarations: `src/declarations.d.ts`

  ```ts
  declare module "*.module.css";
  declare module "*.module.scss";
  ```

**TypeScript**

- Root config: `tsconfig.json`
- Ensure `"include": ["src"]` so module declarations are picked up.

## Directory Overview

- `src/assets/` — Icons and images (`preview.png` shown in README)
- `src/components/`
  - `common/` — Reusable primitives (Button, Header, Modal, etc.)
  - `flights/` — Flight list, cards, and filters
  - `modals/` — `CalendarModal`, `PassengerModal`
  - `search/` — `AirportSelect`, `SearchForm`
- `src/contexts/` — Global contexts (e.g., `ThemeContext`)
- `src/hooks/` — `useDebounce`, `useLocalStorage`
- `src/pages/` — Page components (e.g., `Home`)
- `src/services/` — API layer (`api.ts`)
- `src/styles/` — Global CSS and animations
- `src/types/` — Shared TypeScript types
- `src/utils/` — Utilities/helpers

## Features

- Flight search with origin/destination selection
- Date range picker with calendar modal
- Passenger configuration (adults/children/infants)
- Responsive flight cards with pricing
- Filtering by stops, airlines, and price ranges
- Sorting by price, duration, and departure time
- Theme switching (light/dark mode)
- Animated UI transitions with Framer Motion
- Responsive layout for all device sizes

## Environment Variables

Create `.env` in root directory with your API keys:

```env
VITE_API_KEY=your_flight_data_api_key
VITE_API_ENDPOINT=https://api.flightdata.example.com
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-component`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-component`)
5. Open a pull request
