#!/usr/bin/env node

// Vercel build script to generate Prisma client
import { execSync } from 'child_process';

console.log('Starting Vercel build process...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
  
  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
  
} catch (error) {
  console.error('Build process failed:', error.message);
  process.exit(1);
}
