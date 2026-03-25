import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="h-4 w-32 rounded-lg bg-secondary shimmer" />
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary shimmer" />
              <div className="space-y-2">
                <div className="h-16 w-36 rounded-lg bg-secondary shimmer" />
                <div className="h-3 w-24 rounded-lg bg-secondary shimmer" />
              </div>
            </div>
            <div className="h-5 w-28 rounded-lg bg-secondary shimmer" />
          </div>
          <div className="flex flex-col gap-3 w-40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-full rounded-lg bg-secondary shimmer" />
            ))}
          </div>
        </div>
      </div>
      <div className="glass-card p-6">
        <div className="h-4 w-32 rounded-lg bg-secondary shimmer mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card p-4 h-36 shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
