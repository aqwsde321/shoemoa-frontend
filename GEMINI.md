# Project: Shoemoa Frontend

This document provides a summary of the Shoemoa Frontend project, intended for use by the Gemini CLI.

## Project Overview

Shoemoa Frontend is the user interface for the Shoemoa shoe shopping mall. It is a [Next.js](https://nextjs.org/) application written in [TypeScript](https://www.typescriptlang.org/) and styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/). The project was initially generated using [Vercel v0](https://v0.dev/).

The application includes user-facing features like sign-up/login, product lists with search and sort, product details, a shopping cart, and an order page. It also has an admin section for managing products. The frontend is designed to be responsive and will eventually connect to a Spring Boot REST API for backend services.

## Building and Running

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start a development server, typically on [http://localhost:3000](http://localhost:3000).

### Production Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `.next` directory. Note that `typescript.ignoreBuildErrors` is set to `true` in `next.config.mjs`, so TypeScript errors will not block the build.

To start a production server:

```bash
npm run start
```

### Linting

To check the code for linting errors:

```bash
npm run lint
```

## Development Conventions

*   **UI Components**: The project uses `shadcn/ui` for many of its UI components. These are located in `components/ui`.
*   **API Integration**: API-related code can be found in `lib/api`. The base URL for the API is configured via the `VITE_API_BASE_URL` environment variable.
*   **Mock Data**: Mock data for development is located in `lib/mock-data.ts`.
*   **Deployment**: The project is configured for continuous deployment on [Vercel](https://vercel.com/). Pushing to the `main` branch will trigger a new deployment.
