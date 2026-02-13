# Overview

Wearorithm is an AI-powered fashion assistant application that provides personalized outfit recommendations, style analysis, and wardrobe management. The application combines computer vision, AI recommendations, and user preference learning to help users make confident fashion choices. Built as a full-stack web application with a modern React frontend and Express backend, it integrates Google's Gemini AI for outfit analysis and recommendation generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing with protected routes
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints with centralized route registration
- **Authentication**: JWT-based with bcrypt password hashing
- **File Uploads**: Multer middleware for image processing
- **Error Handling**: Centralized error middleware with structured responses

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon Database (serverless PostgreSQL)
- **Schema**: Strongly typed schema definitions with Zod validation
- **Migration**: Drizzle Kit for schema management and migrations

## Core Data Models
- **Users**: Authentication and basic profile information
- **UserProfiles**: Style preferences, color personality, body type, occasion preferences
- **Outfits**: Generated outfit combinations with AI analysis and confidence scores
- **WardrobeItems**: User's clothing inventory with categorization and tagging
- **OutfitAnalyses**: AI-generated feedback on uploaded outfit images
- **UserFeedback**: User ratings and feedback on recommendations

## Authentication & Authorization
- **Session Management**: JWT tokens stored in localStorage
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Route Protection**: Middleware-based authentication for API endpoints
- **Client Guards**: Protected route components that redirect unauthenticated users

## AI Integration Architecture
- **Provider**: Google Gemini AI for natural language processing and image analysis
- **Recommendation Engine**: Generates outfit suggestions based on user preferences, occasion, and mood
- **Image Analysis**: Computer vision capabilities for outfit suitability scoring and style matching
- **Color Analysis**: Dominant color extraction and complementary color suggestions

## File Upload & Processing
- **Storage**: Memory-based file storage with multer
- **Validation**: File type restrictions (images only) and size limits (5MB)
- **Processing**: Base64 encoding for AI service integration

## Development Tools & Configuration
- **Build System**: Vite with React plugin and runtime error overlay
- **Type Checking**: Strict TypeScript configuration with path mapping
- **Code Quality**: ESLint and Prettier (implied by project structure)
- **Development Server**: Hot module replacement with proxy setup for API routes

# External Dependencies

## AI Services
- **Google Gemini AI**: Primary AI service for outfit recommendations, image analysis, and color palette generation
- **Image Processing**: Computer vision capabilities for outfit analysis and style matching

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting
- **Database Connection**: @neondatabase/serverless for connection pooling

## Authentication & Security
- **JSON Web Tokens**: jwt library for token generation and verification
- **Password Hashing**: bcrypt for secure password storage
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## UI & Design System
- **Radix UI**: Comprehensive set of unstyled, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter, Playfair Display, and Geist Mono font families

## Development & Build Tools
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: TypeScript-first schema validation
- **Wouter**: Lightweight client-side routing

## File Upload & Processing
- **Multer**: Middleware for handling multipart/form-data for file uploads
- **Image Validation**: Built-in file type and size validation

## Development Environment

- **TypeScript**: Strict type checking with module resolution
- **PostCSS**: CSS processing with Tailwind and Autoprefixer