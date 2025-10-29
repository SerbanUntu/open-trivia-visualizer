# Open Trivia DB Visualizer

Interactive client for visualizing distributions of trivia questions from the Open Trivia DB API.

## Table of Contents

- [Overview](#overview)
- [Codebase](#codebase)
  - [Dependencies](#dependencies)
  - [Project Structure](#project-structure)
  - [Architecture Highlights](#architecture-highlights)
- [Installation](#installation)

## Overview

The application fetches a configurable number of trivia questions from the Open Trivia DB API at runtime and renders charts for difficulty and category distributions. Users can filter by category and toggle between chart types. The current selection is reflected in the URL query string. The buttons, inputs and colors are inspired by the IntelliJ IDEA UI.

## Codebase

### Dependencies
 - **react**, **react-dom**: UI and rendering
 - **@vitejs/plugin-react**, **vite**: development server and build
 - **typescript**: static typing
 - **tailwindcss**, **@tailwindcss/vite**: styling
 - **lucide-react**: icons
 - **recharts**: dynamic charts
 - **zod**: runtime type validation
 - **vitest**, **happy-dom**: unit testing
 - **eslint** - linting

### Project Structure

```
open-trivia-visualizer/
├── src/                                # application source code
│   ├── components/                     # UI components and charts
│   │   ├── Button.tsx                  # styled button component
│   │   ├── CategoryChart.tsx           # category distribution chart
│   │   ├── DifficultyChart.tsx         # difficulty distribution chart
│   │   └── ThemeToggle.tsx             # theme toggle button
│   ├── contexts/                       # React contexts
│   │   ├── ThemeContext.ts             # theme context constructor
│   │   └── ThemeProvider.tsx           # theme context provider
│   ├── hooks/                          # reusable React hooks
│   │   ├── use-theme.ts                # theme hook for light/dark mode
│   │   └── use-window.ts               # reactive window size hook
│   ├── lib/                            # domain logic and utilities
│   │   ├── api.ts                      # Open Trivia DB client
│   │   ├── data-processing.ts          # grouping and sorting
│   │   ├── data-processing.test.ts     # tests for data processing
│   │   ├── utils.ts                    # various helper functions
│   │   ├── utils.test.ts               # tests for utils
│   │   ├── types.ts                    # shared TypeScript types
│   │   └── test-questions.json         # fixture data for tests
│   ├── App.tsx                         # application page component
│   ├── main.tsx                        # React entry and bootstrapping
│   └── styles.css                      # Tailwind styles
├── public/                             # static assets
│   └── favicon.png                     # site icon
├── index.html                          # HTML shell
├── vite.config.ts                      # Vite and Vitest configuration
├── tsconfig.json                       # base tsconfig
├── tsconfig.app.json                   # tsconfig for client React
├── tsconfig.node.json                  # tsconfig for node backend
├── eslint.config.js                    # ESLint configuration
├── pnpm-lock.yaml                      # dependency lockfile
├── package.json                        # scripts and dependencies
└── README.md                           # project description
```

### Architecture Highlights

 - Data flow: api.ts fetches questions, zod validates shapes, data-processing.ts groups by difficulty and category, charts render derived datasets
 - State management: App.tsx manages questions, loading, filter, and chart selection with memoized selectors
 - URL sync: Chart type persisted in the query string through utilities for shallow navigation
 - Charts: A bar chart for category distributions and a pie chart for difficulty distributions, provided by **recharts**.
 - Tooling: Vite for development and build, Vitest with happy-dom for unit tests, ESLint for static analysis, Tailwind for styling

## Installation

Prerequisites:
- Node.js
- pnpm (`npm install -g pnpm`)

Steps:
1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start the development server
   ```bash
   pnpm dev
   ```
3. Run type check and build
   ```bash
   pnpm build
   ```
4. Preview the production build
   ```bash
   pnpm preview
   ```
5. Lint and test
   ```bash
   pnpm lint
   pnpm test
   ```
