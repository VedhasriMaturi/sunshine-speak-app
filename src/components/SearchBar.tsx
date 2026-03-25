import { useState, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onDetectLocation: () => void;
  recentSearches: string[];
  loading: boolean;
}

export default function SearchBar({ onSearch, onDetectLocation, recentSearches, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleRecent = (city: string) => {
    onSearch(city);
    setFocused(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search city..."
            className="search-input w-full pl-12 pr-24"
            disabled={loading}
          />
          <div className="absolute right-2 flex gap-1">
            {query && (
              <button type="button" onClick={() => setQuery("")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onDetectLocation}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
              title="Use my location"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {focused && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 w-full glass-card p-2 z-50"
          >
            <p className="text-xs text-muted-foreground px-3 py-1">Recent</p>
            {recentSearches.map((city) => (
              <button
                key={city}
                onMouseDown={() => handleRecent(city)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/50 transition-colors"
              >
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
