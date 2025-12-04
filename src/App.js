/**
 * BluePrint Diagram - Main Application Component
 *
 * A web application that transforms natural language descriptions
 * into professional system architecture diagrams.
 *
 * @author Yassin Hamdi
 * @version 1.0.0
 * @license MIT
 */

import React, { useState, useCallback } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./index.css";

import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { InputSection } from "./components/InputSection";
import { ActionButton } from "./components/ActionButton";
import { OutputSection } from "./components/OutputSection";
import { HistorySidebar } from "./components/HistorySidebar";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { parseArchitecture } from "./utils/architectureParser";
import { generateMermaidDiagram } from "./utils/diagramGenerator";

function App() {
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState([]);
  const [mermaidCode, setMermaidCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage("blueprint-history", []);

  /**
   * Handles the generation of architecture diagrams.
   * Parses user input through the Gemini API and generates Mermaid diagram code.
   * Results are automatically saved to local storage history.
   *
   * @author Yassin Hamdi
   */
  const handleGenerate = useCallback(async () => {
    if (!description.trim() || description.trim().length < 10) return;

    setIsLoading(true);

    try {
      const { components: detectedComponents, connections } =
        await parseArchitecture(description);

      setComponents(detectedComponents);

      // Generate Mermaid diagram with AI-detected connections
      const diagram = generateMermaidDiagram(detectedComponents, connections);
      setMermaidCode(diagram);

      // Save to history
      const historyItem = {
        id: `history_${Date.now()}`,
        description: description,
        components: detectedComponents,
        connections: connections,
        mermaidCode: diagram,
        componentCount: detectedComponents.length,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        const updated = [
          historyItem,
          ...prev.filter((h) => h.description !== description),
        ];
        return updated.slice(0, 5); // Keep only last 5
      });
    } catch (error) {
      console.error("Error generating architecture:", error);
    } finally {
      setIsLoading(false);
    }
  }, [description, setHistory]);

  // Handle history selection
  const handleHistorySelect = useCallback((item) => {
    setDescription(item.description);
    setComponents(item.components);
    setMermaidCode(item.mermaidCode);

    // Scroll to output
    const outputElement = document.getElementById("output-section");
    if (outputElement) {
      outputElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handle history deletion
  const handleHistoryDelete = useCallback(
    (id) => {
      setHistory((prev) => prev.filter((h) => h.id !== id));
    },
    [setHistory]
  );

  // Handle history clear
  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // Handle input clear
  const handleClear = useCallback(() => {
    setDescription("");
    setComponents([]);
    setMermaidCode("");
  }, []);

  // Handle diagram error
  const handleDiagramError = useCallback((error) => {
    console.error("Diagram rendering error:", error);
  }, []);

  // Check if generate button should be disabled
  const isGenerateDisabled =
    !description.trim() || description.trim().length < 10;

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-dark-950 text-dark-100 selection:bg-primary-500/30">
        <div className="bg-noise" />

        <div className="relative z-10">
          {/* Hero Header */}
          <Header />

          <main className="max-w-6xl mx-auto px-4 pb-24">
            {/* Input Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <InputSection
                value={description}
                onChange={setDescription}
                onClear={handleClear}
                maxLength={1000}
              />

              <ActionButton
                onClick={handleGenerate}
                isLoading={isLoading}
                isDisabled={isGenerateDisabled}
              />
            </div>

            {/* Output Section */}
            <div id="output-section">
              <OutputSection
                components={components}
                mermaidCode={mermaidCode}
                onDiagramError={handleDiagramError}
              />
            </div>

            {/* Features Section */}
            <Features />

            {/* How It Works Section */}
            <HowItWorks />
          </main>

          {/* History Sidebar */}
          <HistorySidebar
            history={history}
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onClear={handleHistoryClear}
          />

          {/* Footer */}
          <footer className="py-12 text-center text-dark-500 text-sm border-t border-dark-800/50 bg-dark-900/30 backdrop-blur-sm">
            <p className="mb-4">
              BluePrint Diagram &copy; {new Date().getFullYear()}
            </p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <a
                href="https://www.linkedin.com/in/yassin-hamdi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-indigo-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/medYassinHamdi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
            <p className="opacity-60">
              Made with React, Mermaid.js & Framer Motion
            </p>
          </footer>
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;
