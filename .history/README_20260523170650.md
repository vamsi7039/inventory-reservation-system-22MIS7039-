# Inventory Reservation System

A multi-warehouse inventory reservation platform built using Next.js, Prisma, PostgreSQL, and TypeScript.

## Features

- Product inventory tracking
- Multi warehouse stock management
- Inventory reservation system
- Real-time stock updates
- Reservation APIs
- Prisma ORM integration
- PostgreSQL database

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Run Locally

npm install

Create .env:

DATABASE_URL="your_postgres_url"

Run migrations:

npx prisma generate
npx prisma migrate dev --name init

Seed database:

npm run seed

Start app:

npm run dev

## Reservation Logic

When a user clicks Reserve:
- reservedQuantity increases
- available stock decreases
- if no stock available API returns 409

## Future Improvements

- Reservation expiry worker
- Confirm purchase flow
- Better UI enhancements
- Redis locking
- Idempotency support