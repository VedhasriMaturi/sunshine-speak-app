import { motion } from "framer-motion";

interface UnitToggleProps {
  unit: "C" | "F";
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center rounded-xl bg-secondary/60 p-1 text-sm font-semibold backdrop-blur-sm"
    >
      <span
        className={`px-3 py-1.5 rounded-lg z-10 transition-colors duration-200 ${
          unit === "C" ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        °C
      </span>
      <span
        className={`px-3 py-1.5 rounded-lg z-10 transition-colors duration-200 ${
          unit === "F" ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        °F
      </span>
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-primary"
        animate={{ left: unit === "C" ? 4 : "calc(50%)" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </button>
  );
}
