# Eventos - Tech Stack Documentation

## Project Overview
**Eventos** is a modern **SaaS event dashboard application** built with a robust full-stack JavaScript/TypeScript architecture. It's designed as a responsive web application for event management with features like pricing tiers, user registration, and authentication.

---

## Core Framework & Runtime

### **Next.js 16.2.1**
- **Full-stack React framework** with built-in server-side rendering (SSR) and static site generation (SSG)
- Provides file-based routing system for pages and API routes
- Zero-config setup with automatic code splitting and optimization
- API routes for backend logic (e.g., authentication handlers)
- **Image Optimization**: Configured with remote patterns for GitHub avatars and Google profile pictures
- **TypeScript Support**: Integrated TypeScript compiler with Next.js plugin

### **React 19.2.4 & React DOM 19.2.4**
- Latest major version of React for building component-based UI
- Server Components and Client Components architecture support
- Enhanced concurrent rendering capabilities

### **TypeScript 5.7.3**
- Static type checking for improved code safety and developer experience
- Strict mode enabled for rigorous type checking
- ES6 target compilation
- Path aliasing configured (`@/*` points to root directory)
- JSX support with `react-jsx` transform

---

## Package Management & Build Tools

### **pnpm**
- Fast, disk space efficient package manager
- Strict dependency resolution (monorepo-ready)
- Lock file: `pnpm-lock.yaml`

### **PostCSS 8.5**
- CSS transformation tool used for Tailwind CSS processing
- Plugin: `@tailwindcss/postcss` for integrating Tailwind CSS

---

## Styling & Theming

### **Tailwind CSS 4.2.0** (with @tailwindcss/postcss)
- Utility-first CSS framework
- Configured in PostCSS pipeline
- Autoprefixer 10.4.20 for cross-browser compatibility
- Animation library: `tw-animate-css 1.3.3`

### **next-themes 0.4.6**
- Dark/light mode theme provider and switcher
- Persistent theme preference storage
- System preference detection support

### **Styling Utilities**
- **class-variance-authority 0.7.1**: Type-safe component variant system
- **clsx 2.1.1**: Utility for combining CSS classes conditionally
- **tailwind-merge 3.3.1**: Prevents conflicting Tailwind CSS classes

---

## Component Library & UI System

### **Radix UI (Headless Components)**
Comprehensive set of low-level UI primitives for accessibility-first component building:
- **Navigation**: Navigation Menu, Menubar
- **Data Display**: Accordion, Tabs, Table, Carousel
- **Feedback**: Alert Dialog, Alert, Progress, Toast
- **Input Controls**: Checkbox, Radio Group, Select, Switch, Toggle, Toggle Group, Slider
- **Dialogs**: Dialog, Drawer, Popover, Hover Card, Context Menu, Dropdown Menu
- **Organization**: Breadcrumb, Pagination, Separator
- **Utilities**: Avatar, Badge, Aspect Ratio, Scroll Area, Collapsible
- **Layout**: Resizable panels (`react-resizable-panels 2.1.7`)

### **Lucide React 0.564.0**
- Modern icon library with 564+ SVG icons
- Tree-shakeable for minimal bundle size

### **Ionicons 8.0.13**
- Additional icon set for comprehensive icon coverage

---

## Forms & Data Validation

### **React Hook Form 7.54.1**
- Performant, flexible form library
- Minimal re-renders with uncontrolled components
- Integrated with validation libraries

### **@hookform/resolvers 3.9.1**
- Adapter library for using various schema validators with React Hook Form
- Supports Zod validation schemas

### **Zod 3.24.1**
- TypeScript-first schema validation library
- Runtime type checking
- Provides compile-time type inference

---

## Authentication

### **NextAuth.js 4.24.13**
- Modern authentication solution for Next.js applications
- Configured with multiple OAuth providers
- Session management and JWT support
- API route: `/api/auth/[...nextauth]`
- Integrated with `AuthSessionProvider` component

---

## Data Visualization

### **Recharts 2.15.0**
- React charting library built on D3
- Composable chart components
- Responsive by default
- Used for displaying event metrics and analytics

---

## Date & Time Handling

### **date-fns 4.1.0**
- Modern, modular date utility library
- Tree-shakeable for smaller bundles
- No mutable state (immutable approach)

### **React Day Picker 9.13.2**
- Headless date picker component
- Works with Radix UI Dialog for date selection UI

---

## Input Components

### **Input OTP 1.4.2**
- Specialized component for one-time password (OTP) input
- Used for multi-factor authentication flows

### **Input Group**
- Custom UI component for grouped input fields

---

## Animation & Interaction

### **GSAP 3.14.2**
- Professional animation library
- Advanced timeline and tween capabilities
- Used for complex animations beyond CSS

### **Embla Carousel 8.6.0**
- Headless carousel/slider component
- Touch and keyboard support
- Used in `carousel.tsx` component

### **Vaul 1.1.2**
- React Drawer component library
- Gesture support for mobile-friendly drawers

---

## Notifications & Toasts

### **Sonner 1.7.1**
- Toast notification library for React
- Customizable appearance and positioning
- Supports different toast types (success, error, info, warning)
- Integrated as `Toaster` component

---

## Analytics

---

## Development Tools & Configuration

### **ESLint** (via `eslint .` command)
- Code linting for maintaining code quality
- Configuration: `.eslintrc` or ESLint config in `package.json`

### **Next.js Configuration**
- TypeScript build errors ignored (for faster development)
- Image optimization disabled for static exports
- Remote image patterns configured for OAuth provider avatars

---

## Project Structure

### **Key Directories**
- **`app/`**: Next.js 13+ App Router with server components
  - `api/`: API routes (auth, etc.)
  - `contact/`, `pricing/`, `register/`: Page routes
- **`components/`**: React component library
  - `ui/`: Shadcn-style Radix UI wrapper components
  - `registration/`: Registration flow components
- **`hooks/`**: Custom React hooks (`use-toast`, `use-mobile`)
- **`lib/`**: Utility functions and authentication setup
- **`types/`**: TypeScript type definitions
- **`styles/`**: Global styles and CSS
- **`public/`**: Static assets

---

## Type Definitions

### **Custom Types**
- `ion-icon.d.ts`: Type definitions for Ionicons

---

## Key Features & Capabilities

✅ **Server-Side Rendering** with Next.js
✅ **Static Site Generation** for performance
✅ **Dark/Light Theme Support** with system detection
✅ **Authentication** with NextAuth.js and OAuth providers
✅ **Form Validation** with Zod and React Hook Form
✅ **Accessible UI Components** using Radix UI primitives
✅ **Responsive Design** with Tailwind CSS
✅ **Data Visualization** with Recharts
✅ **Toast Notifications** with Sonner
✅ **Date/Time Handling** with date-fns
✅ **Type-Safe Development** with strict TypeScript

---

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## Browser & Platform Support

- **Modern browsers** with ES6+ support
- **Responsive design** for mobile, tablet, and desktop
- **Dark mode** support via system preferences
- **Touch-friendly** components for mobile devices

---

## Performance Optimizations

- **Code splitting** via Next.js
- **Tree-shakeable** libraries (lucide-react, date-fns, clsx)
- **CSS-in-JS** elimination (Tailwind CSS)
- **Minimal bundle size** through selective component imports

---

## Security Considerations

- **NextAuth.js** for secure session management
- **Zod** for input validation and sanitization
- **TypeScript strict mode** for type safety
- **HTTPS** support for OAuth providers
- **CSP-friendly** architecture with Next.js

---

## Production Deployment

- **Image optimization** configured for remote patterns
- **TypeScript compilation** with production optimizations
- **Next.js** production build with optimizations
- **Static exports** support for static hosting
