# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sonata CRM is a piano technician booking and customer management system built as a Turborepo monorepo with:
- **Frontend**: Next.js 14 app (`apps/web`) running on port 3001
- **Backend**: Express.js API (`apps/api`) running on port 4000  
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider

## Development Commands

### Primary Commands (use Makefile when available)
```bash
# Setup and installation
make install          # Install dependencies for all apps
make generate         # Generate Prisma client
make seed            # Seed database with sample data

# Development
make dev             # Start both frontend and backend servers
make migrate         # Run database migrations
make reset           # Reset database (drops all data)

# Alternative yarn commands
yarn dev             # Start development servers via turbo
yarn build           # Build for production
yarn lint            # Run linting
yarn check-types     # Run type checking
yarn format          # Format code with prettier
```

### App-specific Commands
```bash
# API (Express.js backend)
cd apps/api && yarn dev        # Start API server on port 4000
cd apps/api && yarn build      # Build API
cd apps/api && yarn seed       # Seed database

# Web (Next.js frontend)  
cd apps/web && yarn dev        # Start web server on port 3001
cd apps/web && yarn build      # Build web app
cd apps/web && yarn lint       # Lint with max 0 warnings
cd apps/web && yarn check-types # TypeScript type checking
```

## Architecture

### Database Schema (Prisma)
- **Core Models**: Technician, Customer, Piano, Appointment, ServiceType
- **Scheduling**: WeeklySchedule, TimeSlot, Availability, ScheduleException
- **Business Logic**: ServiceArea, ServiceTypeCategory
- Schema location: `apps/api/prisma/schema.prisma`

### API Structure
- Express.js server with modular route handlers in `apps/api/src/routes/`
- Routes: `/technicians`, `/customers`, `/pianos`, `/service-types`, `/appointments`, `/availability`, `/schedule-exceptions`, `/upload`
- Prisma client initialization in main server file

### Frontend Architecture
- Next.js 14 App Router with TypeScript
- Authentication pages: `/tech/login`, `/tech/sign-up`
- Main dashboard: `/tech/dashboard` with nested routes
- Customer booking flow: `/customer/book` → `/customer/success`
- Component library in `components/` directory
- Global state management with React Context (`providers/`)

### Key File Locations
- API routes: `apps/api/src/routes/`
- Next.js API routes: `apps/web/app/api/`
- Frontend pages: `apps/web/app/`
- Shared components: `apps/web/components/`
- Database migrations: `apps/api/prisma/migrations/`

## Environment Setup

### Required Environment Variables
**Backend (`apps/api/.env`):**
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API server port (default: 4000)

**Frontend (`apps/web/.env`):**
- `NEXTAUTH_SECRET`: NextAuth.js secret key
- `NEXTAUTH_URL`: Frontend URL for auth
- `NEXT_PUBLIC_API_URL`: Backend API URL

### Authentication
- NextAuth.js with credentials provider
- Custom auth logic in `apps/web/app/api/auth/authOptions.ts`
- Session management with JWT strategy
- Test credentials: `juhstinn@gmail.com` / `1234`

## Development Workflow

1. **Database changes**: Edit `apps/api/prisma/schema.prisma` → `make migrate` → `make generate`
2. **API changes**: Modify routes in `apps/api/src/routes/` 
3. **Frontend changes**: Work in `apps/web/app/` and `apps/web/components/`
4. **Type safety**: Run `yarn check-types` before committing
5. **Code quality**: Run `yarn lint` and `yarn format` before committing

## Important Notes

- The project uses Turborepo for monorepo management
- Prisma client must be regenerated after schema changes
- API runs on port 4000, web runs on port 3001 (not 3000)
- Database seeding includes sample technicians and service types
- Frontend uses Tailwind CSS for styling
- File uploads handled via Cloudinary integration