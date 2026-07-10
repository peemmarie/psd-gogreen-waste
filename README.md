# Go Green

Go Green is an environmental learning and engagement platform for campaigns about waste, recycling, and sustainable daily habits. The project is designed around playful activities and game-like experiences that help people learn how to separate waste correctly, reduce single-use behavior, and understand the impact of small actions on the environment.

## Project Focus

- Environmental awareness and behavior change
- Waste separation and recycling education
- Games, missions, quizzes, and challenges related to sustainability
- Campaign dashboards for participation, scores, and impact tracking
- Thai-first content for local users, with room for bilingual support

## Product Direction

The app should feel approachable, optimistic, and action-oriented. Users should be able to quickly understand what they can do next, play or complete a green activity, and see how their actions contribute to a cleaner environment.

Example experiences this project may support:

- Waste sorting mini-game
- Daily green missions
- Recycling knowledge quiz
- Community leaderboard
- Points, badges, and progress tracking
- Campaign summary for organizers

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Bun
- TanStack Query and TanStack Table
- Recharts
- Leaflet / MapLibre for map-based experiences
- Better Auth

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
bun dev      # Start the local development server
bun build    # Build the production app
bun start    # Start the production server
bun lint     # Run ESLint
```

## Docker

Build and run with the provided Makefile:

```bash
make build
make up
```

## Documentation

- [PRODUCT.md](./PRODUCT.md) describes the product vision, audience, tone, and design principles.

## Status

This repository is being shaped into the Go Green product experience. Some existing implementation details may still reflect earlier internal dashboard work and should be renamed or refactored as the Go Green features become the primary product surface.
