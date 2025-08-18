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
- **Phase 3 Migration**: Next.js 15 + React 19 + Tailwind v4 + Comprehensive Dependencies (completed)

## Latest Stack (Updated January 2025)
- **Framework**: Next.js 15.4.6 (latest stable with React 19 support)
- **React**: v19.1.1 (stable release with concurrent features)
- **TypeScript**: v5.9.2 with React 19 types
- **Auth**: Dynamic Labs SDK v4.27.1 (latest with React 19 compatibility)
- **Database**: PostgreSQL + Prisma ORM v6.14.0 (Next.js 15 compatible)
- **Styling**: Tailwind CSS v4.1.12 (CSS-first configuration)
- **Language**: TypeScript with strict configuration

## Migration Notes (Phase 3)
### Next.js 15 Features Implemented
- React 19 stable support in App Router
- New caching strategies (no longer cached by default)
- Improved TypeScript support with next.config.ts compatibility
- Enhanced performance with new bundling optimizations

### Tailwind CSS v4 Migration
- **Breaking Change**: Configuration moved from `tailwind.config.ts` to CSS-first approach
- **PostCSS**: Now requires `@tailwindcss/postcss` plugin instead of `tailwindcss`
- **Zero Config**: Minimal configuration needed, fonts defined in `@theme` block
- **Custom Properties**: Maintained existing design system with CSS variables

### Dynamic Labs Integration
- Updated to v4.27.1 for React 19 compatibility
- Added npm overrides to force React 19 compatibility
- Hybrid auth approach maintained (server/client pattern)
- All wallet connection flows tested and working

### Performance Improvements
- Build time: ~60s (optimized from previous versions)
- Development startup: ~3.2s (faster hot reloading)
- Bundle optimization with Next.js 15 tree-shaking
- Modern CSS features with Tailwind v4

## Tech Debt & Future Work
- Implement comprehensive troubleshooting docs
- Add blog post listing and individual post pages
- Consider Turbopack in development (stable in Next.js 15)
- Update to React 19 concurrent features usage