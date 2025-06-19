# Sonata CRM

A modern booking and management system for piano technicians and their customers.

## 🎹 About

Sonata CRM is a full-stack application built with Next.js, Express.js, and PostgreSQL. It provides piano technicians with tools to manage customers, appointments, and service records.

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (Frontend), Railway (Backend & Database)
- **Monorepo**: Turborepo

## 📁 Project Structure

```
sonata-crm/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Express.js backend API
├── packages/         # Shared packages and configurations
└── prisma/          # Database schema and migrations
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Make (for using Makefile scripts)
- PostgreSQL database

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/sonata-crm.git
cd sonata-crm
make install
```

### 2. Environment Setup

#### Backend (API)
1. Copy the example environment file:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
2. Update `apps/api/.env` with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database_name"
   PORT=4000
   ```

#### Frontend (Web)
1. Copy the example environment file:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
2. Update `apps/web/.env` with your configuration:
   ```
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```

### 3. Database Setup

```bash
make generate    # Generate Prisma client
make migrate     # Run database migrations
make seed        # Seed the database with sample data
```

### 4. Start Development Servers

```bash
make dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📦 Available Scripts

### Makefile Commands (Recommended)

```bash
make install     # Install dependencies for all apps
make generate    # Generate Prisma client
make seed        # Seed database with sample data
make dev         # Start both frontend and backend in development
make migrate     # Run database migrations
make reset       # Reset database (drops all data and re-runs migrations)
```

### Manual Commands

```bash
# Install dependencies
yarn install

# Run development servers
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Run type checking
yarn type-check
```

## 🔐 Authentication

The application uses NextAuth.js for authentication. Default test credentials:
- Email: `juhstinn@gmail.com`
- Password: `1234`

## 🗄️ Database Management

```bash
# Generate Prisma client after schema changes
make generate

# Create and apply new migrations
make migrate

# Reset database (⚠️ This will delete all data)
make reset

# Seed database with sample data
make seed
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `PORT`
3. Deploy automatically on push to main

## 🔧 Development Workflow

1. **Start development**: `make dev`
2. **Make changes** to your code
3. **Database changes**: `make migrate`
4. **Reset if needed**: `make reset && make seed`
5. **Test your changes**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
