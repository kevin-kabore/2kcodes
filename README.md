# 2kcodes

A modern portfolio and blog platform built with Next.js 14, featuring authentication, markdown blog editor, and Web3 integration.

## 🌟 Current Features

### Implemented ✅
- **Portfolio Landing Page**: Hero section with animated text, About, Experience, Featured Posts, and Contact sections
- **Authentication System**: Complete auth flow with NextAuth.js (email/password + OAuth)
- **Blog Editor**: Markdown editor with live preview for creating blog posts
- **Dark/Light Theme**: System-aware theme switching with persistent preferences
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Dashboard**: Protected user area with profile information
- **Web3 Ready**: Dynamic wallet connection (Solana support)

### In Progress 🚧
- Individual blog post pages
- Blog post management (edit/delete)
- Blog search and categories
- Full static export support (currently requires server for auth routes)

## 🛠️ Tech Stack

- **Framework**: [Next.js 14.2.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Material-UI](https://mui.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Editor**: [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Web3**: [Dynamic](https://dynamic.xyz/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevin-kabore/2kcodes.git
   cd 2kcodes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/2kcodes"
   
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
   
   # Deployment
   NEXT_PUBLIC_STATIC_EXPORT="false"  # Set "true" for GitHub Pages
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npm run db:push
   
   # Run migrations (for existing databases)
   npm run migrate:dev
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

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
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI
npm run migrate:dev  # Create and run migrations (development)
npm run migrate:prod # Run migrations (production)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

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

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Option 2: GitHub Pages (Static Export)

> ⚠️ **Note**: Static export disables authentication, database features, and blog creation.

1. Set in `.env.production`:
   ```env
   NEXT_PUBLIC_STATIC_EXPORT=true
   ```

2. Configure GitHub Secrets:
   - `NEXTAUTH_SECRET`
   - `DYNAMIC_ENVIRONMENT_ID` (optional)

3. Enable GitHub Pages:
   - Settings → Pages → Deploy from branch
   - Select `gh-pages` branch

4. Push to main branch

### Option 3: Self-Hosted

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

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT encryption |
| `GITHUB_ID` | No | GitHub OAuth App ID |
| `GITHUB_SECRET` | No | GitHub OAuth App Secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |
| `DYNAMIC_ENVIRONMENT_ID` | No | Dynamic.xyz environment ID |
| `NEXT_PUBLIC_STATIC_EXPORT` | No | Enable static export mode |

### Feature Flags

Features are automatically enabled/disabled based on deployment type:

```typescript
// lib/config/deployment.ts
export const deploymentConfig = {
  isStaticExport: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true',
  features: {
    authentication: !isStaticExport,
    blog: {
      read: true,
      write: !isStaticExport,
    },
    database: !isStaticExport,
    web3: true,  // Client-side only
  }
}
```

## 🐛 Known Issues

1. **Blog System**:
   - Individual blog post pages not implemented
   - Blog listing shows placeholder content
   - Edit/delete functionality missing

2. **Dashboard**:
   - "Edit Profile" button non-functional
   - "Create Your First Post" not linked

3. **Static Export**:
   - Authentication features disabled
   - Database operations unavailable
   - Blog creation disabled

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

**Note**: This project is actively under development. Some features are incomplete or in progress.