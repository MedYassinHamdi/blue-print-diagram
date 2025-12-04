import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Cpu, GitGraph } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe",
    desc: "Type your project idea in plain English",
  },
  {
    icon: Cpu,
    title: "Analyze",
    desc: "AI identifies components & relationships",
  },
  {
    icon: GitGraph,
    title: "Visualize",
    desc: "Get a complete architecture diagram",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-16"
        >
          From Text to Diagram in Seconds
        </motion.h2>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent hidden md:block -translate-y-8" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/5 relative group">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <step.icon className="w-8 h-8 text-primary-400 relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-dark-400 text-sm max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
