/**
 * Gemini API Service
 *
 * Handles communication with Google's Gemini API for natural language
 * processing of architecture descriptions. Extracts components and
 * their relationships from user input.
 *
 * @author Yassin Hamdi
 * @module utils/geminiService
 */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `You are a system architecture expert. Given a description of a software system, extract the components and their connections.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "components": [
    {
      "name": "Component Name",
      "type": "frontend|backend|database|auth|cache|storage|queue|service",
      "description": "Brief description of what this component does"
    }
  ],
  "connections": [
    {
      "from": "Source Component Name",
      "to": "Target Component Name",
      "label": "optional description of the connection"
    }
  ]
}

Component type definitions:
- frontend: UI, web apps, mobile apps, dashboards, portals
- backend: APIs, servers, microservices, lambda functions
- database: Any database (SQL, NoSQL, data stores)
- auth: Authentication, authorization, identity services
- cache: Redis, Memcached, CDN, caching layers
- storage: File storage, S3, blob storage, media storage
- queue: Message queues, Kafka, RabbitMQ, event streams
- service: Email, notifications, payments, analytics, AI/ML, third-party integrations

Rules:
1. Extract meaningful components based on the description
2. Infer logical connections between components (data flow, dependencies)
3. Use specific names when mentioned (e.g., "PostgreSQL" not just "Database")
4. If the description is vague, create a reasonable minimal architecture
5. Always include at least a frontend, backend, and database for web applications
6. Return ONLY the JSON object, nothing else`;

/**
 * Sends architecture description to Gemini API for intelligent parsing.
 * Extracts system components and their logical connections.
 *
 * @author Yassin Hamdi
 * @param {string} description - Natural language description of the system architecture
 * @returns {Promise<Object>} Parsed components and connections
 * @throws {Error} If API key is missing or request fails
 */
export async function parseWithGemini(description) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser's system description:\n${description}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  // Extract the text content from Gemini's response
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("No response from Gemini");
  }

  // Parse the JSON from the response
  // Remove any markdown code blocks if present
  let jsonString = textContent.trim();
  if (jsonString.startsWith("```json")) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith("```")) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith("```")) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  const parsed = JSON.parse(jsonString);

  // Validate the response structure
  if (!parsed.components || !Array.isArray(parsed.components)) {
    throw new Error("Invalid response structure: missing components array");
  }

  return parsed;
}

/** Maps component types to their corresponding Lucide icon names */
const typeIcons = {
  frontend: "Monitor",
  backend: "Server",
  database: "Database",
  auth: "Shield",
  cache: "Zap",
  storage: "HardDrive",
  queue: "GitBranch",
  service: "Cpu",
};

/**
 * Transforms raw Gemini API response into the application's component structure.
 * Assigns unique IDs, icons, and colors to each component.
 *
 * @param {Object} geminiResponse - Raw response from Gemini API
 * @returns {Object} Formatted components and connections arrays
 */
export function transformGeminiResponse(geminiResponse) {
  const components = geminiResponse.components.map((comp, index) => ({
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: comp.name,
    type: comp.type || "service",
    icon: typeIcons[comp.type] || "Box",
    color: comp.type || "service",
    description: comp.description || `${comp.name} component`,
  }));

  // Include connections from Gemini response
  const connections = geminiResponse.connections || [];

  return { components, connections };
}
