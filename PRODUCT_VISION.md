# 2kcodes - Product Vision

## Core Concept
A minimal, elegant portfolio site that seamlessly transitions into a Web3-enabled blog platform. Think Apple's simplicity meets Medium's reading experience with Web3 capabilities.

## User Journey
1. **Land** → Clean, impressive portfolio showcasing who Kevin is
2. **Explore** → Discover blog posts with compelling previews  
3. **Read** → Beautiful reading experience
4. **Connect** → Traditional contact or Web3 wallet connection
5. **Create** → Authenticated users can write their own posts
6. **Mint** → Transform posts into NFTs (Web3 differentiator)

## Landing Page Structure

### 1. Hero Section (Current - Needs Polish)
- **Keep**: Video background, typewriter effect
- **Improve**: 
  - Smoother animations (60fps)
  - Better video loading (progressive)
  - Subtle parallax on scroll
  - Clear CTA: "Read My Thoughts" → Blog

### 2. About Section (New)
- **Design**: Full-width, minimal text, maximum impact
- **Content**: 2-3 sentences about Kevin
- **Animation**: Fade in on scroll, subtle letter spacing animation
- **Style**: Large typography, lots of whitespace

### 3. Experience Showcase (New)
- **Design**: Timeline or cards (Apple-style)
- **Content**: 
  - Peloton Interactive (current)
  - Paperspace
  - Key achievements
- **Animation**: Stagger fade-in
- **Interactive**: Hover states with subtle depth

### 4. Featured Blog Posts (New)
- **Design**: 3 featured posts in cards
- **Content**: Title, excerpt, read time, date
- **Animation**: Slide up on scroll
- **Style**: Gradient borders on hover (OpenAI style)

### 5. Contact/Connect (New)
- **Traditional**: Email, LinkedIn, GitHub
- **Web3**: "Connect Wallet" button
- **Design**: Floating cards with glassmorphism
- **Animation**: Magnetic hover effect

## Blog Platform Structure

### Blog Home (/blog)
- **Hero**: Minimal search bar (Netflix-style)
- **Categories**: Tags with pill design
- **Posts Grid**: Masonry layout with varying card sizes
- **Infinite Scroll**: Smooth loading

### Blog Post (/blog/[slug])
- **Typography**: Beautiful reading experience (Medium-inspired)
- **Features**:
  - Progress bar
  - Table of contents (floating)
  - Share buttons
  - "Mint as NFT" button (if Web3 connected)
  - Author card at bottom

### Write Post (/blog/write)
- **Editor**: Minimal, distraction-free
- **Features**:
  - Markdown with live preview
  - Drag-drop images
  - Auto-save indicator
  - SEO preview
  - Publish/Draft toggle

## Design System

### Colors
**Light Mode**:
- Background: #FFFFFF
- Text: #000000
- Accent: #5B21B6 (Purple)
- Secondary: #F3F4F6

**Dark Mode**:
- Background: #000000
- Text: #FFFFFF  
- Accent: #8B5CF6 (Lighter Purple)
- Secondary: #1F2937

### Typography
- Headers: SF Pro Display / Inter
- Body: SF Pro Text / Inter
- Code: SF Mono / Fira Code

### Animations
- Micro-interactions on everything
- Smooth scroll behaviors
- Parallax on key sections
- Stagger animations for lists
- Page transitions (Framer Motion)

### Components
- Buttons: Rounded, subtle shadows
- Cards: Clean borders, hover depth
- Inputs: Minimal, floating labels
- Navigation: Sticky, blur background

## Technical Architecture

### Performance First
- Static generation for portfolio
- ISR for blog posts
- Optimized images (Next.js Image)
- Code splitting
- Font optimization

### SEO Optimized
- Meta tags for all pages
- Open Graph for social sharing
- Structured data for blog posts
- Sitemap generation
- RSS feed

### Web3 Integration
- Progressive enhancement (works without wallet)
- ENS name resolution
- Multi-chain support
- IPFS for permanence
- Smart contract for NFTs

## Questions for Kevin:
1. Do you have a resume/LinkedIn I can reference for the experience section?
2. What's your one-liner bio? (e.g., "Building the future of X at Peloton")
3. What categories/topics will you blog about? (Tech, Web3, Career, etc.)
4. Do you have brand colors in mind or stick with purple?
5. Any specific projects/achievements to highlight?
6. Preferred social links to display?