const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Debug: Log if API key is available (only first few chars for security)
console.log(
  "Gemini API Key loaded:",
  GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "NOT FOUND"
);

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

export async function parseWithGemini(description) {
  console.log("Gemini API Key exists:", !!GEMINI_API_KEY);

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  console.log("Calling Gemini API...");

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

  console.log("Gemini API response status:", response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API error:", errorData);
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`
    );
  }

  const data = await response.json();
  console.log("Gemini API raw response:", data);

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

// Icon mapping for component types
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

// Transform Gemini response to match existing component structure
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
