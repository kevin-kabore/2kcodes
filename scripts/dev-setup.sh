#!/bin/bash

# 2kcodes Development Setup Script
# This script sets up the development environment after a fresh clone

set -e  # Exit on any error

echo "🚀 Setting up 2kcodes development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/${NC}"
        exit 1
    fi
    
    node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version must be 18 or higher. Current: $(node --version)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm $(npm --version)${NC}"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        echo -e "${YELLOW}⚠️  PostgreSQL not found. Please install PostgreSQL:${NC}"
        echo "   macOS: brew install postgresql@14"
        echo "   Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✅ PostgreSQL found${NC}"
    fi
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Setup environment file
setup_env() {
    echo "🔧 Setting up environment file..."
    
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ Created .env.local from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env.local with your database credentials and other settings${NC}"
        
        # Try to detect local PostgreSQL and suggest URL
        if command -v psql &> /dev/null; then
            echo -e "${BLUE}💡 Suggested DATABASE_URL for local PostgreSQL:${NC}"
            echo "   postgresql://$(whoami)@localhost:5432/2kcodes"
            echo ""
            echo -e "${BLUE}💡 Create the database with:${NC}"
            echo "   createdb 2kcodes"
        fi
    else
        echo -e "${GREEN}✅ .env.local already exists${NC}"
    fi
}

# Start PostgreSQL if on macOS with Homebrew
start_postgres() {
    echo "🐘 Starting PostgreSQL..."
    
    if command -v brew &> /dev/null; then
        if brew services list | grep -q "postgresql.*started"; then
            echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
        else
            echo "Starting PostgreSQL with Homebrew..."
            brew services start postgresql@14 2>/dev/null || brew services start postgresql || {
                echo -e "${YELLOW}⚠️  Could not start PostgreSQL automatically. Please start it manually.${NC}"
            }
        fi
    else
        echo -e "${YELLOW}⚠️  Please ensure PostgreSQL is running${NC}"
    fi
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    # Check if .env.local has DATABASE_URL
    if ! grep -q "^DATABASE_URL=" .env.local || grep -q "your-database-url-here" .env.local; then
        echo -e "${RED}❌ Please configure DATABASE_URL in .env.local first${NC}"
        echo "Example: postgresql://username:password@localhost:5432/2kcodes"
        return 1
    fi
    
    # Generate Prisma client
    echo "Generating Prisma client..."
    npx dotenv -e .env.local -- prisma generate
    
    # Push database schema
    echo "Pushing database schema..."
    npx dotenv -e .env.local -- prisma db push
    
    # Seed database
    echo "Seeding database with sample data..."
    npx dotenv -e .env.local -- npm run db:seed 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Seeding failed or no seed script found${NC}"
    }
    
    echo -e "${GREEN}✅ Database setup complete${NC}"
}

# Generate NextAuth secret
generate_secret() {
    if grep -q "your-secret-key-here" .env.local; then
        echo "🔐 Generating NextAuth secret..."
        
        if command -v openssl &> /dev/null; then
            secret=$(openssl rand -base64 32)
            sed -i.bak "s/your-secret-key-here/$secret/" .env.local && rm .env.local.bak
            echo -e "${GREEN}✅ NextAuth secret generated${NC}"
        else
            echo -e "${YELLOW}⚠️  Please generate NEXTAUTH_SECRET manually:${NC}"
            echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
        fi
    fi
}

# Main execution
main() {
    check_prerequisites
    install_dependencies
    setup_env
    
    echo ""
    echo -e "${BLUE}📝 Please edit .env.local with your configuration:${NC}"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - NEXTAUTH_SECRET: Will be generated automatically"
    echo "   - Optional: OAuth provider credentials (GitHub, Google)"
    echo "   - Optional: DYNAMIC_ENVIRONMENT_ID for Web3 features"
    echo ""
    
    read -p "Press Enter when you've configured .env.local..."
    
    generate_secret
    start_postgres
    
    if setup_database; then
        echo ""
        echo -e "${GREEN}🎉 Setup complete! You can now run:${NC}"
        echo "   npm run dev    # Start development server"
        echo "   npm run db:studio    # Open database GUI"
        echo ""
        echo -e "${BLUE}📖 Visit http://localhost:3000 to see your app${NC}"
    else
        echo ""
        echo -e "${RED}❌ Database setup failed. Please configure DATABASE_URL in .env.local and try:${NC}"
        echo "   npm run setup:db"
    fi
}

# Run main function
main "$@"