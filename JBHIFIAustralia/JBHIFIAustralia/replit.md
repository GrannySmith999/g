# Overview

This is a modern e-commerce application built as a full-stack TypeScript project with a React frontend and Express backend. The application provides a complete online shopping experience with product browsing, cart management, multilingual support (English/Spanish), and integrated Stripe payment processing. The system uses a PostgreSQL database with Drizzle ORM for data management and includes Telegram notifications for order updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built with React and uses a modern component-based architecture:

- **UI Framework**: React with TypeScript, using Vite for bundling and development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state, custom hooks for local state (cart, language)
- **Form Handling**: React Hook Form with Zod validation
- **Payment Integration**: Stripe React components for secure payment processing

The frontend follows a feature-based structure with reusable components, custom hooks for business logic, and proper separation of concerns. It supports internationalization with English and Spanish translations.

## Backend Architecture

The server uses Express.js with TypeScript and follows RESTful API conventions:

- **Framework**: Express.js with TypeScript
- **API Design**: REST endpoints for categories, products, and orders
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe integration for secure payment handling
- **Notifications**: Telegram bot integration for order notifications
- **Development Setup**: Vite middleware integration for seamless full-stack development

The backend implements a storage abstraction layer with both in-memory and database implementations, making it easy to switch between development and production environments.

## Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Design**: Relational schema with users, categories, products, orders, and order items
- **Migration Management**: Drizzle Kit for database schema migrations
- **Connection**: Neon serverless driver for optimal performance

The schema supports multilingual content (English/Spanish), product categorization, inventory management, and order tracking with payment status.

## Authentication and Authorization

Currently implements a basic session-based approach:

- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Basic user schema with profile information
- **Security**: Express session configuration with secure cookies

## External Dependencies

- **Payment Processing**: Stripe for secure credit card processing and payment intent handling
- **Notifications**: Telegram Bot API for real-time order notifications to administrators
- **Database Hosting**: Neon serverless PostgreSQL for scalable database operations
- **UI Components**: Radix UI primitives through shadcn/ui for accessible, customizable components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Development Tools**: Replit-specific plugins for enhanced development experience in cloud environment

The architecture prioritizes type safety, developer experience, and scalability while maintaining clear separation between frontend and backend concerns.