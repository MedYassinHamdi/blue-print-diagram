/**
 * Output Section Component
 *
 * Two-panel layout displaying detected components and
 * the generated architecture diagram side by side.
 *
 * @author Yassin Hamdi
 */

import React from "react";
import { ComponentCard } from "./ComponentCard";
import { DiagramViewer } from "./DiagramViewer";

export function OutputSection({ components, mermaidCode, onDiagramError }) {
  const hasOutput = components.length > 0 || mermaidCode;

  if (!hasOutput) {
    return null;
  }

  return (
    <section
      className="animate-fade-in"
      aria-label="Generated architecture output"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Components */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wide">
              Components
            </h2>
            <span className="px-2 py-0.5 text-xs rounded-md bg-dark-800 text-dark-400">
              {components.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
            {components.map((component, index) => (
              <ComponentCard
                key={component.id}
                component={component}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Right Panel: Diagram */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wide">
              Architecture
            </h2>
          </div>

          <DiagramViewer mermaidCode={mermaidCode} onError={onDiagramError} />
        </div>
      </div>
    </section>
  );
}
