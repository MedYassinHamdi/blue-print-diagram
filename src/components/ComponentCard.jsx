import React from "react";
import {
  Monitor,
  Server,
  Database,
  Shield,
  Zap,
  HardDrive,
  GitBranch,
  Cpu,
  Box,
} from "lucide-react";

const iconMap = {
  Monitor,
  Server,
  Database,
  Shield,
  Zap,
  HardDrive,
  GitBranch,
  Cpu,
  Box,
};

const typeLabels = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  auth: "Security",
  cache: "Cache",
  storage: "Storage",
  queue: "Queue",
  service: "Service",
};

export function ComponentCard({ component, index }) {
  const IconComponent = iconMap[component.icon] || Box;

  return (
    <div
      className={`card card-hover p-4 opacity-0 animate-stagger stagger-${
        (index % 8) + 1
      }`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2.5 rounded-xl badge-${component.color} border`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-dark-100 truncate">
              {component.name}
            </h3>
          </div>

          {/* Type badge */}
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full badge-${component.color} border`}
          >
            {typeLabels[component.type] || "Component"}
          </span>

          {/* Description */}
          {component.description && (
            <p className="mt-2 text-sm text-dark-400 line-clamp-2">
              {component.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
