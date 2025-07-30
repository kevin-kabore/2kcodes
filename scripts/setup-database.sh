#!/bin/bash

echo "🔧 Database Setup for 2kcodes"
echo "============================="
echo ""
echo "Choose your database setup:"
echo "1) Local PostgreSQL (requires PostgreSQL installed)"
echo "2) Supabase (Cloud - Free tier available)"
echo "3) Neon (Cloud - Serverless PostgreSQL)"
echo "4) Custom database URL"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo "Setting up local PostgreSQL..."
    
    # Check if PostgreSQL is installed
    if ! command -v psql &> /dev/null; then
      echo "PostgreSQL is not installed. Please install it first:"
      echo "macOS: brew install postgresql@16"
      echo "Ubuntu: sudo apt-get install postgresql"
      exit 1
    fi
    
    # Create database
    createdb 2kcodes 2>/dev/null || echo "Database '2kcodes' already exists"
    
    # Update .env files
    DATABASE_URL="postgresql://$(whoami)@localhost:5432/2kcodes?schema=public"
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env.local
    
    echo "✅ Local database configured!"
    ;;
    
  2)
    echo ""
    echo "To use Supabase:"
    echo "1. Go to https://supabase.com"
    echo "2. Create a new project"
    echo "3. Go to Settings > Database"
    echo "4. Copy the connection string"
    echo ""
    read -p "Enter your Supabase DATABASE_URL: " DATABASE_URL
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
    echo "✅ Supabase database configured!"
    ;;
    
  3)
    echo ""
    echo "To use Neon:"
    echo "1. Go to https://neon.tech"
    echo "2. Create a new project"
    echo "3. Copy the connection string from the dashboard"
    echo ""
    read -p "Enter your Neon DATABASE_URL: " DATABASE_URL
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
    echo "✅ Neon database configured!"
    ;;
    
  4)
    read -p "Enter your custom DATABASE_URL: " DATABASE_URL
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
    echo "✅ Custom database configured!"
    ;;
    
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "You can now run:"
echo "  npm run dev    - Start the development server"
echo "  npx prisma studio - Open database GUI"