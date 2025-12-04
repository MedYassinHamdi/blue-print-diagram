import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { toPng } from "html-to-image";
import {
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Check,
  AlertCircle,
} from "lucide-react";

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#f1f5f9",
    primaryBorderColor: "#4f46e5",
    lineColor: "#64748b",
    secondaryColor: "#1e293b",
    tertiaryColor: "#0f172a",
    background: "#0f172a",
    mainBkg: "#1e293b",
    textColor: "#f1f5f9",
    fontSize: "14px",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 20,
  },
  securityLevel: "loose",
});

export function DiagramViewer({ mermaidCode, onError }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [diagramSvg, setDiagramSvg] = useState("");

  useEffect(() => {
    if (!mermaidCode) {
      setDiagramSvg("");
      setError(null);
      return;
    }

    const renderDiagram = async () => {
      try {
        // Generate unique ID for this render
        const id = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidCode);
        setDiagramSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram. Please check your description.");
        setDiagramSvg("");
        onError?.(err);
      }
    };

    renderDiagram();
  }, [mermaidCode, onError]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      const diagramElement =
        containerRef.current.querySelector(".mermaid-content");
      if (!diagramElement) return;

      const dataUrl = await toPng(diagramElement, {
        backgroundColor: "#0f172a",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `architecture-diagram-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!mermaidCode && !error) {
    return (
      <div className="card p-8 text-center text-dark-400">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-dark-500" />
        </div>
        <p className="text-lg font-medium text-dark-300">No diagram yet</p>
        <p className="text-sm mt-1">
          Generate an architecture to see the visualization
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? "fixed inset-0 z-50 p-8 bg-dark-950" : ""}`}
    >
      <div className={`card ${isFullscreen ? "h-full flex flex-col" : ""}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="font-semibold text-dark-200">Architecture Diagram</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
              title="Copy Mermaid Code"
              aria-label="Copy Mermaid code to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
              title="Download as PNG"
              aria-label="Download diagram as PNG"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Diagram container */}
        <div className={`p-6 overflow-auto ${isFullscreen ? "flex-1" : ""}`}>
          {error ? (
            <div className="text-center text-rose-400 p-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : (
            <div
              className="mermaid-content flex justify-center"
              dangerouslySetInnerHTML={{ __html: diagramSvg }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
