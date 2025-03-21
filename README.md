# Employee Management System

A modern web application for managing employee records, built with Lit and Web Components. This application provides a clean and efficient interface for handling employee data, including creation, editing, listing, and deletion of employee records.

![Coverage Status](https://img.shields.io/badge/coverage-96%25-brightgreen.svg)
![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.2-green.svg)

## Features

- 📝 CRUD operations for employee management
- 🌐 Internationalization support (English/Turkish)
- 📱 Responsive design
- 🎯 High test coverage (96%)
- 🔄 State management with custom store
- 📊 List/Grid view options
- 🔍 Search capabilities
- 📄 Pagination support

## Tech Stack

- [Lit](https://lit.dev/) - For creating fast, lightweight web components
- [@vaadin/router](https://vaadin.com/router) - For client-side routing
- [Web Components](https://www.webcomponents.org/) - For creating reusable components
- [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/) - For testing web components
- [Sinon](https://sinonjs.org/) - For test spies, stubs, and mocks

## Project Structure

```
src/
├── components/     # Reusable web components
├── pages/         # Page components
├── services/      # Core services (router, store, etc.)
├── utils/         # Utility functions
├── i18n/          # Internationalization files
├── constants/     # Constants and enums
├── routes/        # Route configurations
├── assets/        # Static assets
└── app.js         # Main application entry

test/
├── components/    # Component tests
├── pages/        # Page tests
├── services/     # Service tests
└── utils/        # Utility tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employee-management.git
   cd employee-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run serve
   ```

The application will be available at `http://localhost:8000`

## Development

### Available Scripts

- `npm run serve` - Start development server
- `npm run test` - Run all tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier

### Testing

The project has comprehensive test coverage:
- Statement Coverage: 96.47%
- Branch Coverage: 96.32%
- Function Coverage: 91.8%
- Line Coverage: 96.47%

Run tests with coverage report:
```bash
npm run test:coverage:report
```

### Code Style

The project uses ESLint and Prettier for code formatting. Run the following commands:

```bash
npm run lint     # Check code style
npm run format   # Fix code style
```

## Acknowledgments

- [Lit](https://lit.dev/) for providing an excellent web components library
- [@open-wc](https://open-wc.org/) for testing utilities and best practices
- [Vaadin](https://vaadin.com/) for the router implementation 