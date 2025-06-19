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

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/sonata-crm.git
cd sonata-crm
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Environment Setup

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

### 4. Database Setup

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run the development servers

```bash
# Terminal 1: Backend API
cd apps/api
yarn dev

# Terminal 2: Frontend
cd apps/web
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 🔐 Authentication

The application uses NextAuth.js for authentication. Default test credentials:
- Email: `juhstinn@gmail.com`
- Password: `1234`

## 📦 Available Scripts

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

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
