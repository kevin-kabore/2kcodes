# 2kcodes - Portfolio & Web3 Blog

A modern portfolio website with Web3 blog capabilities built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 15** with App Router
- 🔒 **Type-safe** with TypeScript and strict configuration
- 🎨 **Tailwind CSS** for styling with dark mode support
- 🗄️ **PostgreSQL + Prisma** for data persistence
- 🔐 **NextAuth.js** for authentication (traditional + Web3)
- ⚡ **tRPC** for end-to-end type-safe APIs
- 🧪 **Vitest** for unit testing
- 🎭 **Playwright** for E2E testing
- 📝 **Biome** for linting and formatting
- 🔄 **React Query** for data fetching
- 🌐 **Web3 Ready** with wallet connection support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **API**: tRPC
- **Testing**: Vitest, React Testing Library, Playwright
- **Linting/Formatting**: Biome
- **State Management**: Zustand
- **Data Fetching**: Tanstack Query

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2kcodes.git
cd 2kcodes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- Database connection string
- NextAuth secret (generate with `openssl rand -base64 32`)
- OAuth provider credentials (optional)

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting with Biome
- `npm run format` - Format code with Biome
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run E2E tests
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
2kcodes/
├── app/                    # Next.js App Router
│   ├── components/        # React components
│   ├── api/              # API routes
│   └── (routes)/         # Page routes
├── lib/                   # Utility functions
├── server/               # Server-side code
│   ├── api/             # tRPC routers
│   └── db.ts            # Database client
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── test/                 # Test configuration
└── types/                # TypeScript type definitions
```

## Development

### Code Style

This project uses Biome for linting and formatting. Configuration can be found in `biome.json`.

### Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Coverage report: `npm run test:coverage`

### Type Safety

- Strict TypeScript configuration
- Type-safe environment variables with `@t3-oss/env-nextjs`
- End-to-end type safety with tRPC
- Type-safe database queries with Prisma

## Security

- Environment variables validation
- Secure password hashing with Argon2
- CSRF protection
- Rate limiting
- Security headers configured
- Content Security Policy

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker build -t 2kcodes .
docker run -p 3000:3000 2kcodes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- All open source contributors