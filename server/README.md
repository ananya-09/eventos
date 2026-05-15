# Server Architecture

This directory contains the core backend logic, following a layered architecture pattern to ensure scalability and maintainability.

## Layers

### 1. Database (db/)
Contains the Prisma client singleton. All database interactions should go through this client.

### 2. Repositories (repositories/)
The Data Access Layer. Repositories are responsible for low-level database operations (CRUD). They should be agnostic of business logic and focus on data retrieval and persistence.

### 3. Services (services/)
The Business Logic Layer. Services coordinate repositories to perform complex operations, enforce business rules, and handle orchestrations (e.g., sending emails, external API calls).

### 4. Validators (validators/)
Contains Zod schemas for input validation. These are used in API routes and services to ensure data integrity.

### 5. Permissions (permissions/)
Logic for Role-Based Access Control (RBAC). Functions here determine if a user has the right to perform a specific action.

### 6. Utils (utils/)
General-purpose utility functions used across the server.

### 7. Constants (constants/)
Shared constants like pagination limits, roles, etc.

### 8. Types (types/)
Global TypeScript types and interfaces used in the server layer.

## Pattern Flow
`API Route` -> `Validator` -> `Service` -> `Repository` -> `Prisma`
