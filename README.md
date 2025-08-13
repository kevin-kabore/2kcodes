# 2kcodes

A modern portfolio and blog platform built with Next.js 14, featuring
authentication, markdown blog editor, and Web3 integration.

## 🌟 Current Features

### Implemented ✅

- **Portfolio Landing Page**: Hero section with animated text, About,
  Experience, Featured Posts, and Contact sections
- **Authentication System**: Complete auth flow with NextAuth.js
  (email/password + OAuth)
- **Blog Editor**: Markdown editor with live preview for creating blog posts
- **Dark/Light Theme**: System-aware theme switching with persistent preferences
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Dashboard**: Protected user area with profile information
- **Web3 Ready**: Dynamic wallet connection (Solana support)

### In Progress 🚧

- Individual blog post pages
- Blog post management (edit/delete)
- Blog search and categories

## 🛠️ Tech Stack

- **Framework**: [Next.js 14.2.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) +
  [Material-UI](https://mui.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) +
  [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Editor**: [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Web3**: [Dynamic](https://dynamic.xyz/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Quick Setup (Recommended)

For a complete automated setup after cloning:

```bash
git clone https://github.com/kevin-kabore/2kcodes.git
cd 2kcodes
./scripts/dev-setup.sh
```

This script will:

- Check prerequisites
- Install dependencies
- Set up environment files
- Start PostgreSQL (macOS)
- Configure database
- Generate secrets

### Manual Setup

If you prefer manual setup or the script doesn't work on your system:

#### 1. **Clone and Install**

```bash
git clone https://github.com/kevin-kabore/2kcodes.git
cd 2kcodes
npm install
```

#### 2. **Start PostgreSQL**

**macOS (Homebrew):**

```bash
brew services start postgresql@14
# Or use our npm script:
npm run postgres:start
```

**Ubuntu/Debian:**

```bash
sudo service postgresql start
```

**Other systems:** Ensure PostgreSQL is running on port 5432

#### 3. **Create Database**

```bash
createdb 2kcodes
```

#### 4. **Environment Configuration**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database (Required)
DATABASE_URL="postgresql://yourusername@localhost:5432/2kcodes"

# Authentication (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32

# OAuth Providers (Optional)
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Web3 (Optional)
DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"
```

> **Note:** The DATABASE_URL format for local PostgreSQL is usually:
> `postgresql://username@localhost:5432/2kcodes` (no password needed for local
> dev)

#### 5. **Database Setup**

```bash
# Setup everything at once
npm run setup:db

# Or step by step:
npm run db:generate    # Generate Prisma client
npm run db:push       # Create/update database schema
npm run db:seed       # Add sample data (optional)
```

#### 6. **Start Development**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Troubleshooting Setup

**Database Connection Issues:**

- Ensure PostgreSQL is running: `npm run postgres:status`
- Check database exists: `psql -l` (should show '2kcodes')
- Verify DATABASE_URL format in .env.local

**Environment Variable Issues:**

- Prisma looks for variables in .env.local (not .env)
- All database commands use: `dotenv -e .env.local -- prisma ...`
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

**Permission Issues:**

- Make sure your PostgreSQL user has database creation rights
- On macOS with Homebrew, your system user usually has full access

## 📁 Project Structure

```
2kcodes/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth.js endpoints
│   │   ├── blog/         # Blog CRUD operations
│   │   └── user/         # User operations (wallet sync)
│   ├── auth/             # Authentication pages
│   ├── blog/             # Blog pages
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts (theme)
│   ├── dashboard/        # Protected user area
│   └── (root pages)      # Landing page sections
├── lib/
│   ├── auth/             # Auth configuration
│   ├── config/           # App configuration
│   └── db.ts             # Database client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/               # Static assets
├── types/                # TypeScript definitions
└── .github/              # GitHub Actions workflows
```

## 📝 Available Scripts

```bash
# Setup & Development
npm run setup        # Complete setup (env + database)
npm run setup:env    # Copy .env.example to .env.local
npm run setup:db     # Generate client + push schema + seed
npm run dev          # Start development server (http://localhost:3000)
npm run dev:full     # Complete setup + start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database Management
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations (development)
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database (⚠️ deletes all data)

# PostgreSQL Control (macOS)
npm run postgres:start   # Start PostgreSQL service
npm run postgres:stop    # Stop PostgreSQL service
npm run postgres:status  # Check PostgreSQL status

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

> **💡 Quick Start Commands:**
>
> - Fresh clone: `npm run setup && npm run dev`
> - Already configured: `npm run dev`
> - Database issues: `npm run postgres:start && npm run setup:db`

## 🔐 Authentication

The app uses NextAuth.js v5 with multiple providers:

- **Credentials**: Email/password with argon2 hashing
- **OAuth**: GitHub and Google (configure in `.env.local`)

Protected routes:

- `/dashboard` - User dashboard
- `/blog/write` - Create blog posts
- `/admin/*` - Admin area (role-based)

## 📝 Blog System

### Current Capabilities

- Create blog posts with markdown
- Live preview while editing
- Metadata: title, excerpt, tags, categories
- Cover image support
- Draft/publish states
- Automatic slug generation

### API Endpoints

- `POST /api/blog/posts` - Create new post
- `GET /api/blog/posts` - List posts (planned)

## 🎨 Theming

The app supports dark and light themes with:

- System preference detection
- Manual toggle in navigation
- Persistent user preference
- Smooth transitions

## 🚀 Deployment

### Vercel (Recommended)

#### Quick Setup

1. Import project at [vercel.com/new](https://vercel.com/new)
2. Add environment variables (see below)
3. Deploy!

#### Required Environment Variables

```env
# Database (Required)
DATABASE_URL="postgresql://..."  # Use Vercel Postgres or external DB

# Authentication (Required)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="..."  # Generate with: openssl rand -base64 32

# OAuth (Optional but recommended)
GITHUB_ID="..."
GITHUB_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Web3 (Optional)
DYNAMIC_ENVIRONMENT_ID="..."
```

#### Post-Deployment Steps

1. **Database Setup**:

   - If using Vercel Postgres: Storage → Create Database → Postgres
   - Run migrations: Deploy hooks or manually via terminal

2. **OAuth Configuration**:

   - GitHub: Settings → Developer settings → OAuth Apps
   - Google: [console.cloud.google.com](https://console.cloud.google.com)
   - Callback URLs: `https://your-app.vercel.app/api/auth/callback/[provider]`

3. **Update NEXTAUTH_URL** with your actual Vercel URL

### Self-Hosted

```bash
# Build
npm run build

# Start
npm start
```

Or use Docker:

```bash
docker build -t 2kcodes .
docker run -p 3000:3000 --env-file .env.production 2kcodes
```

## 🗂️ Database Schema

```prisma
model User {
  id            String     @id
  username      String?    @unique
  email         String     @unique
  password      String?
  walletAddress String?
  role          Role       @default(USER)
  blogPosts     BlogPost[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model BlogPost {
  id          String   @id
  authorId    String
  title       String
  slug        String   @unique
  excerpt     String?
  content     String
  coverImage  String?
  published   Boolean  @default(false)
  viewCount   Int      @default(0)
  author      User     @relation(...)
  category    Category?
  tags        Tag[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔧 Configuration

### Environment Variables

| Variable                 | Required | Description                  |
| ------------------------ | -------- | ---------------------------- |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string |
| `NEXTAUTH_URL`           | Yes      | Application URL              |
| `NEXTAUTH_SECRET`        | Yes      | Secret for JWT encryption    |
| `GITHUB_ID`              | No       | GitHub OAuth App ID          |
| `GITHUB_SECRET`          | No       | GitHub OAuth App Secret      |
| `GOOGLE_CLIENT_ID`       | No       | Google OAuth Client ID       |
| `GOOGLE_CLIENT_SECRET`   | No       | Google OAuth Client Secret   |
| `DYNAMIC_ENVIRONMENT_ID` | No       | Dynamic.xyz environment ID   |

## 🐛 Known Issues

1. **Blog System**:

   - Individual blog post pages not implemented
   - Blog listing shows placeholder content
   - Edit/delete functionality missing

2. **Dashboard**:
   - "Edit Profile" button non-functional
   - "Create Your First Post" not linked

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All open source contributors

---

**Note**: This project is actively under development. Some features are
incomplete or in progress.
