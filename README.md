# Next.js Template Base

A modern, feature-rich Next.js template with a comprehensive setup for building scalable web applications.

## 🚀 Tech Stack

### Core Framework
- **Next.js** - React framework for production
- **React** - UI library
- **TypeScript** - Type-safe JavaScript

### UI Framework & Styling
- **NextUI** - Modern and beautiful React UI library
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Testing
- **Vitest** - Fast and modern testing framework
  - Unit Testing
  - Integration Testing
  - Production Testing Configuration

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **dotenv** - Environment variable management
  - Development (.env)
  - Test (.env.test)
  - Production Test (.env.test.production)

### CI/CD
- **GitLab CI/CD** - Automated pipeline configuration

## 📁 Project Structure

```
├── app/                  # Next.js app directory (new app router)
├── components/          # Reusable React components
├── config/             # Configuration files
├── lib/                # Library code and utilities
├── public/             # Static assets
├── styles/            # Global styles
├── test/              # Test files and configurations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🛠️ Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## 🧪 Testing

Run different test suites:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run production tests
npm run test:production
```

## 🔒 Environment Variables

The project uses multiple environment configurations:
- `.env` - Default development environment
- `.env.test` - Test environment
- `.env.test.production` - Production test environment

## 📚 Additional Features

- Type-safe environment variables with `environment.d.ts`
- Global type declarations in `global.d.ts`
- Instrumentation hooks for monitoring
- VSCode configuration for optimal development experience
