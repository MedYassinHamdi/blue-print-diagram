# BluePrint Diagram


[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A web application that transforms natural language descriptions into professional system architecture diagrams using AI-powered parsing and Mermaid.js visualization.

## Overview

BluePrint Diagram enables developers and architects to rapidly generate visual representations of system architectures by describing them in plain text. The application leverages Google's Gemini API to intelligently parse descriptions and identify components, relationships, and data flows.

## Features

- **AI-Powered Parsing**: Utilizes Google Gemini API to understand and extract architecture components from natural language
- **Intelligent Component Detection**: Automatically identifies frontends, backends, databases, caches, queues, and services
- **Smart Connection Mapping**: Infers logical relationships and data flows between components
- **Interactive Diagrams**: Renders professional flowcharts using Mermaid.js with custom styling
- **Export Capabilities**: Download diagrams as high-resolution PNG images
- **Code Export**: Copy Mermaid syntax for use in documentation or other tools
- **History Management**: Persistent storage of previous diagrams with quick restore
- **Responsive UI**: Optimized experience across desktop and mobile devices
- **Smooth Animations**: Polished interactions using Framer Motion

## Tech Stack

| Category   | Technology                |
| ---------- | ------------------------- |
| Frontend   | React 18, JavaScript ES6+ |
| Styling    | Tailwind CSS 3.x          |
| Diagrams   | Mermaid.js                |
| AI/NLP     | Google Gemini API         |
| Animations | Framer Motion             |
| Icons      | Lucide React, React Icons |
| Build      | Create React App          |

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
git clone https://github.com/medYassinHamdi/blue-print-diagram.git
cd blue-print-diagram
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

## Project Structure

```
blue-print-diagram/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx          # Hero section with branding
│   │   ├── InputSection.jsx    # Text input for descriptions
│   │   ├── OutputSection.jsx   # Component cards and diagram
│   │   ├── DiagramViewer.jsx   # Mermaid renderer with controls
│   │   ├── ComponentCard.jsx   # Individual component display
│   │   ├── HistorySidebar.jsx  # Collapsible history panel
│   │   ├── Features.jsx        # Feature showcase section
│   │   └── HowItWorks.jsx      # Step-by-step guide
│   ├── hooks/              # Custom React hooks
│   │   ├── useLocalStorage.js  # Persistent state management
│   │   └── useDebounce.js      # Input debouncing
│   ├── utils/              # Utility functions
│   │   ├── geminiService.js    # Gemini API integration
│   │   ├── architectureParser.js # Component extraction logic
│   │   └── diagramGenerator.js # Mermaid syntax generation
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── .env                    # Environment variables
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies and scripts
```

## Usage Examples

### E-commerce Platform

```
An e-commerce platform with React frontend, Node.js API, PostgreSQL database,
Redis cache, Stripe payment integration, and S3 for product images
```

### Microservices Architecture

```
A microservices system with API gateway, user service, order service,
notification service using RabbitMQ, MongoDB databases, and Redis caching
```

## Author

**Yassin Hamdi**

- GitHub: [github.com/medYassinHamdi](https://github.com/medYassinHamdi)
- LinkedIn: [linkedin.com/in/yassin-hamdi](https://www.linkedin.com/in/yassin-hamdi)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
