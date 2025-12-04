/**
 * Mermaid Diagram Generator
 *
 * Generates Mermaid.js flowchart syntax from parsed architecture components.
 * Creates layered diagrams with proper styling and connections.
 *
 * @author Yassin Hamdi
 * @module utils/diagramGenerator
 */

/**
 * Generates Mermaid flowchart code from architecture components.
 *
 * Creates a layered diagram with subgraphs for each component type.
 * Supports both API-provided connections and automatic layer-based connections.
 *
 * @author Yassin Hamdi
 * @param {Array} components - Array of component objects with name, type, etc.
 * @param {Array} connections - Optional array of connection objects from API
 * @returns {string} Mermaid flowchart diagram code
 */
export function generateMermaidDiagram(components, connections = []) {
  if (!components || components.length === 0) {
    return "";
  }

  // Group components by type
  const grouped = components.reduce((acc, comp) => {
    if (!acc[comp.type]) acc[comp.type] = [];
    acc[comp.type].push(comp);
    return acc;
  }, {});

  // Build Mermaid flowchart
  let diagram = "flowchart TB\n";

  // Add styling
  diagram += "    %% Styling\n";
  diagram += "    classDef frontend fill:#10b981,stroke:#059669,color:#fff\n";
  diagram += "    classDef backend fill:#3b82f6,stroke:#2563eb,color:#fff\n";
  diagram += "    classDef database fill:#f59e0b,stroke:#d97706,color:#fff\n";
  diagram += "    classDef service fill:#8b5cf6,stroke:#7c3aed,color:#fff\n";
  diagram += "    classDef cache fill:#ef4444,stroke:#dc2626,color:#fff\n";
  diagram += "    classDef storage fill:#06b6d4,stroke:#0891b2,color:#fff\n";
  diagram += "    classDef queue fill:#f97316,stroke:#ea580c,color:#fff\n";
  diagram += "    classDef auth fill:#ec4899,stroke:#db2777,color:#fff\n\n";

  // Create subgraphs for each layer
  const layers = {
    frontend: { name: "Client Layer", order: 1 },
    backend: { name: "Application Layer", order: 2 },
    auth: { name: "Security Layer", order: 3 },
    service: { name: "Services", order: 4 },
    cache: { name: "Caching Layer", order: 5 },
    queue: { name: "Message Layer", order: 6 },
    storage: { name: "Storage Layer", order: 7 },
    database: { name: "Data Layer", order: 8 },
  };

  // Sort layers by order
  const sortedTypes = Object.keys(grouped).sort(
    (a, b) => (layers[a]?.order || 99) - (layers[b]?.order || 99)
  );

  // Generate nodes for each component
  const nodeIds = new Map();
  let nodeIndex = 0;

  sortedTypes.forEach((type) => {
    const comps = grouped[type];
    const layerName = layers[type]?.name || "Other";

    diagram += `    subgraph ${type.toUpperCase()}["${layerName}"]\n`;

    comps.forEach((comp) => {
      const nodeId = `node${nodeIndex++}`;
      nodeIds.set(comp.name, nodeId);

      // Use different shapes based on type
      let shape = "";
      switch (type) {
        case "database":
          shape = `[(${comp.name})]`;
          break;
        case "queue":
          shape = `>>${comp.name}]`;
          break;
        case "storage":
          shape = `[/${comp.name}/]`;
          break;
        case "cache":
          shape = `((${comp.name}))`;
          break;
        default:
          shape = `[${comp.name}]`;
      }

      diagram += `        ${nodeId}${shape}\n`;
    });

    diagram += "    end\n\n";
  });

  // Generate connections
  diagram += "    %% Connections\n";

  // If we have LLM-provided connections, use those
  if (connections && connections.length > 0) {
    connections.forEach((conn) => {
      const fromId = nodeIds.get(conn.from);
      const toId = nodeIds.get(conn.to);
      if (fromId && toId) {
        if (conn.label) {
          diagram += `    ${fromId} -->|${conn.label}| ${toId}\n`;
        } else {
          diagram += `    ${fromId} --> ${toId}\n`;
        }
      }
    });
  } else {
    // Fallback to hardcoded connections based on layer types
    // Connect frontend to backend
    if (grouped.frontend && grouped.backend) {
      grouped.frontend.forEach((f) => {
        grouped.backend.forEach((b) => {
          const fId = nodeIds.get(f.name);
          const bId = nodeIds.get(b.name);
          if (fId && bId) {
            diagram += `    ${fId} --> ${bId}\n`;
          }
        });
      });
    }

    // Connect backend to auth
    if (grouped.backend && grouped.auth) {
      grouped.backend.forEach((b) => {
        grouped.auth.forEach((a) => {
          const bId = nodeIds.get(b.name);
          const aId = nodeIds.get(a.name);
          if (bId && aId) {
            diagram += `    ${bId} <--> ${aId}\n`;
          }
        });
      });
    }

    // Connect backend to database
    if (grouped.backend && grouped.database) {
      grouped.backend.forEach((b) => {
        grouped.database.forEach((d) => {
          const bId = nodeIds.get(b.name);
          const dId = nodeIds.get(d.name);
          if (bId && dId) {
            diagram += `    ${bId} --> ${dId}\n`;
          }
        });
      });
    }

    // Connect backend to cache
    if (grouped.backend && grouped.cache) {
      grouped.backend.forEach((b) => {
        grouped.cache.forEach((c) => {
          const bId = nodeIds.get(b.name);
          const cId = nodeIds.get(c.name);
          if (bId && cId) {
            diagram += `    ${bId} <--> ${cId}\n`;
          }
        });
      });
    }

    // Connect backend to services
    if (grouped.backend && grouped.service) {
      grouped.backend.forEach((b) => {
        grouped.service.forEach((s) => {
          const bId = nodeIds.get(b.name);
          const sId = nodeIds.get(s.name);
          if (bId && sId) {
            diagram += `    ${bId} --> ${sId}\n`;
          }
        });
      });
    }

    // Connect backend to queue
    if (grouped.backend && grouped.queue) {
      grouped.backend.forEach((b) => {
        grouped.queue.forEach((q) => {
          const bId = nodeIds.get(b.name);
          const qId = nodeIds.get(q.name);
          if (bId && qId) {
            diagram += `    ${bId} --> ${qId}\n`;
          }
        });
      });
    }

    // Connect backend to storage
    if (grouped.backend && grouped.storage) {
      grouped.backend.forEach((b) => {
        grouped.storage.forEach((s) => {
          const bId = nodeIds.get(b.name);
          const sId = nodeIds.get(s.name);
          if (bId && sId) {
            diagram += `    ${bId} --> ${sId}\n`;
          }
        });
      });
    }

    // Connect services to database (for services that might need data access)
    if (grouped.service && grouped.database) {
      grouped.service.slice(0, 2).forEach((s) => {
        grouped.database.forEach((d) => {
          const sId = nodeIds.get(s.name);
          const dId = nodeIds.get(d.name);
          if (sId && dId) {
            diagram += `    ${sId} -.-> ${dId}\n`;
          }
        });
      });
    }
  }

  // Apply class styles
  diagram += "\n    %% Apply styles\n";
  sortedTypes.forEach((type) => {
    const comps = grouped[type];
    comps.forEach((comp) => {
      const nodeId = nodeIds.get(comp.name);
      if (nodeId) {
        diagram += `    class ${nodeId} ${type}\n`;
      }
    });
  });

  return diagram;
}
