import React from "react";
import { X } from "lucide-react";

export function InputSection({ value, onChange, onClear, maxLength = 1000 }) {
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;

  return (
    <section className="mb-6" aria-labelledby="input-label">
      <div className="relative">
        <textarea
          id="project-description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your project... e.g., An e-commerce platform with user accounts, product catalog, shopping cart, payment processing, and order management."
          className="input-field min-h-[140px] resize-none pr-10 text-base leading-relaxed"
          maxLength={maxLength}
          aria-describedby="char-count"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-dark-700/60 text-dark-500 hover:text-dark-300 transition-colors"
            aria-label="Clear input"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Character counter */}
      <div
        id="char-count"
        className={`mt-2 text-xs text-right transition-colors ${
          isNearLimit ? "text-amber-400" : "text-dark-600"
        }`}
        aria-live="polite"
      >
        {charCount.toLocaleString()}/{maxLength.toLocaleString()}
      </div>
    </section>
  );
}
