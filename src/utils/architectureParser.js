/**
 * Architecture Parser
 *
 * Parses natural language descriptions into structured architecture components.
 * Uses Gemini API as primary parser with keyword-based fallback.
 *
 * @author Yassin Hamdi
 * @module utils/architectureParser
 */

import { parseWithGemini, transformGeminiResponse } from "./geminiService";

/** Component patterns for keyword-based detection (fallback) */
const componentPatterns = {
  frontend: {
    keywords: [
      "ui",
      "frontend",
      "web app",
      "mobile app",
      "react",
      "vue",
      "angular",
      "dashboard",
      "portal",
      "interface",
      "client",
      "spa",
      "pwa",
      "website",
      "landing page",
      "admin panel",
      "user interface",
    ],
    icon: "Monitor",
    color: "frontend",
  },
  backend: {
    keywords: [
      "api",
      "backend",
      "server",
      "rest",
      "graphql",
      "microservice",
      "service",
      "endpoint",
      "controller",
      "node",
      "express",
      "django",
      "spring",
      "fastapi",
      "lambda",
      "serverless",
    ],
    icon: "Server",
    color: "backend",
  },
  database: {
    keywords: [
      "database",
      "db",
      "postgresql",
      "mysql",
      "mongodb",
      "sql",
      "nosql",
      "data store",
      "repository",
      "persistence",
      "storage",
      "dynamo",
      "cosmos",
      "sqlite",
      "oracle",
      "data layer",
    ],
    icon: "Database",
    color: "database",
  },
  auth: {
    keywords: [
      "authentication",
      "auth",
      "login",
      "signup",
      "oauth",
      "jwt",
      "session",
      "user management",
      "identity",
      "sso",
      "permission",
      "role",
      "access control",
      "security",
      "2fa",
      "mfa",
    ],
    icon: "Shield",
    color: "auth",
  },
  cache: {
    keywords: [
      "cache",
      "redis",
      "memcached",
      "caching",
      "cdn",
      "cloudfront",
      "edge",
      "session store",
    ],
    icon: "Zap",
    color: "cache",
  },
  storage: {
    keywords: [
      "file storage",
      "s3",
      "blob",
      "upload",
      "image",
      "media",
      "asset",
      "bucket",
      "object storage",
      "file system",
      "document storage",
    ],
    icon: "HardDrive",
    color: "storage",
  },
  queue: {
    keywords: [
      "queue",
      "message",
      "rabbitmq",
      "kafka",
      "sqs",
      "pub/sub",
      "event",
      "streaming",
      "worker",
      "job",
      "background",
      "async",
    ],
    icon: "GitBranch",
    color: "queue",
  },
  service: {
    keywords: [
      "email",
      "notification",
      "push",
      "sms",
      "payment",
      "stripe",
      "analytics",
      "logging",
      "monitoring",
      "search",
      "elasticsearch",
      "ai",
      "ml",
      "chat",
      "real-time",
      "websocket",
      "socket",
    ],
    icon: "Cpu",
    color: "service",
  },
};

/** Maps common features to their typical component sets */
const featureToComponents = {
  "user authentication": ["Auth Service", "User Database", "Session Cache"],
  "real-time chat": [
    "WebSocket Server",
    "Chat Service",
    "Message Queue",
    "Chat Database",
  ],
  "image uploads": ["File Storage", "Media Processing Service", "CDN"],
  "admin dashboard": ["Admin Frontend", "Admin API", "Analytics Service"],
  payment: ["Payment Gateway", "Payment Service", "Transaction Database"],
  notification: ["Notification Service", "Push Notification", "Email Service"],
  search: ["Search Engine", "Search Index", "Search API"],
  "social media": [
    "Social Feed",
    "User Profiles",
    "Content Database",
    "Media Storage",
  ],
  "e-commerce": [
    "Product Catalog",
    "Shopping Cart",
    "Order Service",
    "Inventory Database",
  ],
  blog: ["Content Management", "Blog Database", "Comment Service"],
  analytics: ["Analytics Engine", "Data Warehouse", "Reporting Dashboard"],
};

/**
 * Parses architecture description using Gemini API with keyword fallback.
 *
 * Primary flow uses the Gemini API for intelligent component detection.
 * Falls back to keyword-based parsing if API is unavailable or fails.
 *
 * @author Yassin Hamdi
 * @param {string} description - Natural language system description
 * @returns {Promise<Object>} Object containing components and connections arrays
 */
export async function parseArchitecture(description) {
  if (!description || description.trim().length < 10) {
    return { components: [], connections: [] };
  }

  // Try Gemini API first
  try {
    const geminiResponse = await parseWithGemini(description);
    const result = transformGeminiResponse(geminiResponse);

    if (result.components.length > 0) {
      return result;
    }
  } catch (error) {
    console.warn(
      "Gemini API failed, falling back to keyword parsing:",
      error.message
    );
  }

  // Fallback to keyword-based parsing
  const components = parseArchitectureFallback(description);
  return { components, connections: [] };
}

/**
 * Fallback parser using keyword matching when API is unavailable.
 * Scans description for known technology keywords and maps them to components.
 *
 * @param {string} description - System description text
 * @returns {Array} Array of detected component objects
 */
function parseArchitectureFallback(description) {
  if (!description || description.trim().length < 10) {
    return [];
  }

  const lowerDesc = description.toLowerCase();
  const detectedComponents = new Map();

  // First pass: detect explicit component types
  Object.entries(componentPatterns).forEach(([type, config]) => {
    config.keywords.forEach((keyword) => {
      if (lowerDesc.includes(keyword)) {
        const componentName = generateComponentName(keyword, type);
        if (!detectedComponents.has(componentName)) {
          detectedComponents.set(componentName, {
            id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: componentName,
            type: type,
            icon: config.icon,
            color: config.color,
            description: `Handles ${keyword} functionality`,
          });
        }
      }
    });
  });

  // Second pass: detect feature-based components
  Object.entries(featureToComponents).forEach(([feature, components]) => {
    if (lowerDesc.includes(feature)) {
      components.forEach((compName) => {
        if (!detectedComponents.has(compName)) {
          const type = inferComponentType(compName);
          detectedComponents.set(compName, {
            id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: compName,
            type: type,
            icon: componentPatterns[type]?.icon || "Box",
            color: componentPatterns[type]?.color || "service",
            description: `Part of ${feature} feature`,
          });
        }
      });
    }
  });

  // Ensure basic architecture if minimal components detected
  const components = Array.from(detectedComponents.values());

  if (components.length < 3 && description.trim().length > 20) {
    // Add default web app architecture
    const defaults = [
      {
        name: "Web Application",
        type: "frontend",
        icon: "Monitor",
        color: "frontend",
        description: "Main user interface",
      },
      {
        name: "API Server",
        type: "backend",
        icon: "Server",
        color: "backend",
        description: "Backend API layer",
      },
      {
        name: "Database",
        type: "database",
        icon: "Database",
        color: "database",
        description: "Data persistence layer",
      },
    ];

    defaults.forEach((def) => {
      if (!components.find((c) => c.type === def.type)) {
        components.push({
          id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...def,
        });
      }
    });
  }

  return components;
}

function generateComponentName(keyword, type) {
  const nameMap = {
    ui: "UI Layer",
    frontend: "Frontend App",
    "web app": "Web Application",
    "mobile app": "Mobile App",
    dashboard: "Dashboard",
    api: "API Gateway",
    backend: "Backend Server",
    server: "Application Server",
    microservice: "Microservices",
    database: "Primary Database",
    db: "Database",
    postgresql: "PostgreSQL DB",
    mysql: "MySQL DB",
    mongodb: "MongoDB",
    authentication: "Auth Service",
    auth: "Authentication",
    login: "Login Service",
    cache: "Cache Layer",
    redis: "Redis Cache",
    cdn: "CDN",
    "file storage": "File Storage",
    s3: "S3 Storage",
    upload: "Upload Service",
    queue: "Message Queue",
    kafka: "Kafka Streams",
    email: "Email Service",
    payment: "Payment Gateway",
    notification: "Notification Service",
    analytics: "Analytics Engine",
    search: "Search Engine",
    chat: "Chat Service",
    "real-time": "Real-time Engine",
    websocket: "WebSocket Server",
  };

  return (
    nameMap[keyword] ||
    `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Service`
  );
}

function inferComponentType(componentName) {
  const lowerName = componentName.toLowerCase();

  if (
    lowerName.includes("frontend") ||
    lowerName.includes("dashboard") ||
    lowerName.includes("ui")
  ) {
    return "frontend";
  }
  if (
    lowerName.includes("database") ||
    lowerName.includes("db") ||
    lowerName.includes("storage")
  ) {
    return "database";
  }
  if (lowerName.includes("cache") || lowerName.includes("cdn")) {
    return "cache";
  }
  if (lowerName.includes("auth") || lowerName.includes("session")) {
    return "auth";
  }
  if (lowerName.includes("queue") || lowerName.includes("worker")) {
    return "queue";
  }
  if (
    lowerName.includes("file") ||
    lowerName.includes("media") ||
    lowerName.includes("asset")
  ) {
    return "storage";
  }
  if (lowerName.includes("api") || lowerName.includes("server")) {
    return "backend";
  }

  return "service";
}
