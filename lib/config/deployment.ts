export const deploymentConfig = {
  // Set to true for static export (GitHub Pages), false for server deployment
  isStaticExport: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true',
  
  // Feature flags based on deployment type
  features: {
    authentication: process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true',
    blog: {
      read: true, // Always allow reading
      write: process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true',
    },
    web3: true, // Client-side only, works in static
    database: process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true',
  },
  
  // URLs
  baseUrl: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' 
    ? 'https://kevin-kabore.github.io/2kcodes'
    : process.env.NEXTAUTH_URL || 'http://localhost:3000',
}