import React, { useState } from "react";
import {
  History,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Clock,
  X,
} from "lucide-react";

export function HistorySidebar({ history, onSelect, onDelete, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <aside
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
      aria-label="Diagram history"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-1/2 -translate-y-1/2 -left-10 p-2 rounded-l-xl bg-dark-800 border border-r-0 border-dark-700 hover:bg-dark-700 transition-all ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        title="Open history"
      >
        <History className="w-5 h-5 text-primary-400" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full text-[10px] text-white flex items-center justify-center">
          {history.length}
        </span>
      </button>

      {/* Sidebar Panel */}
      <div
        className={`card p-4 w-72 max-h-[500px] overflow-hidden flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0 mr-4" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary-400" />
            <h3 className="font-semibold text-dark-200">History</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-dark-500 hover:text-rose-400 transition-colors"
                title="Clear all history"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
              title="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="group relative p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 hover:border-primary-500/30 transition-all cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-dark-700">
                  <Clock className="w-4 h-4 text-dark-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-200 line-clamp-2 mb-1">
                    {item.description.substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <span>{item.componentCount} components</span>
                    <span>•</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 transition-colors" />
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-dark-700 text-dark-500 hover:text-rose-400 transition-all"
                title="Delete from history"
                aria-label="Delete this item from history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
