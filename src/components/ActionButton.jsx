import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

export function ActionButton({ onClick, isLoading, isDisabled }) {
  return (
    <div className="mb-8 flex justify-center">
      <button
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className="btn-primary inline-flex items-center gap-2.5 text-base px-6 py-3"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>Generate Diagram</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
