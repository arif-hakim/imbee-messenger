# Imbee Messenger

A notification service using Firebase Cloud Messaging (FCM) and RabbitMQ.

## Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Firebase service account JSON file
- .ENV file

## Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and RabbitMQ credentials.

3. **Add Firebase credentials**

   Place your Firebase service account JSON file at the project root:
   ```
   firebase-service-account.json
   ```

## Running with Docker

```bash
docker-compose up --build -d
```

This starts:
- App server on port 3000
- MySQL on port 3303
- RabbitMQ on port 5672 (management UI on 15672)

## Running locally

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
