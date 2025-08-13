# 2kcodes Project Context

## Current Architecture
- **Framework**: Next.js 14 App Router
- **Auth**: Dynamic Labs SDK (removed NextAuth completely) 
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS only (removed MUI for consistency)
- **Language**: TypeScript
- **Forms**: React Hook Form + Zod validation

## Key Patterns for This Project
- **Server components** for data fetching, **client components** for Dynamic auth
- **Hybrid auth approach**: Server renders data, client handles auth state
- **Single source of truth** for styling (Tailwind only)

## Important Commands
- `npm run type-check` - TypeScript validation
- `npx dotenv-cli -e .env.local -- [command]` - Run with env vars loaded
- `npx prisma db push` - Sync schema to database (development)
- `npm run setup` - Full project setup for fresh clones

## Recent Major Changes
- **Auth Migration**: NextAuth → Dynamic Labs (completed)
- **UI Consistency**: MUI → Tailwind (completed) 
- **Dependency Cleanup**: Removed 41 unused packages
- **Database Schema**: Updated for Dynamic auth pattern (no auto-generated IDs)

## Tech Debt & Future Work
- Update to Next.js 15 after MVP
- Implement comprehensive troubleshooting docs
- Add blog post listing and individual post pages