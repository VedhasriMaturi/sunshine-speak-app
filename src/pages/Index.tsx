import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudSun, AlertCircle } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UnitToggle from "@/components/UnitToggle";
import { useWeather } from "@/hooks/useWeather";
import { getWeatherBackground } from "@/services/weatherApi";

export default function Index() {
  const { weather, loading, error, searchByCity, detectLocation, recentSearches } = useWeather();
  const [unit, setUnit] = useState<"C" | "F">("C");

  const bgClass = weather ? getWeatherBackground(weather.current.weatherCode, weather.current.isDay) : "";

  return (
    <div className={`weather-bg ${bgClass} relative overflow-hidden`}>
      {/* Subtle ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-5">
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground tracking-tight">WeatherNow</h1>
          </div>
          <UnitToggle unit={unit} onToggle={() => setUnit((u) => (u === "C" ? "F" : "C"))} />
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center px-4 sm:px-8 pb-12 pt-4 sm:pt-8 gap-6 max-w-3xl mx-auto w-full">
          <SearchBar
            onSearch={searchByCity}
            onDetectLocation={detectLocation}
            recentSearches={recentSearches}
            loading={loading}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <LoadingSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center w-full"
              >
                <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
                <p className="text-foreground font-medium">{error}</p>
                <p className="text-muted-foreground text-sm mt-1">Try searching for another city</p>
              </motion.div>
            ) : weather ? (
              <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-6">
                <CurrentWeatherCard data={weather} unit={unit} />
                <ForecastCard forecast={weather.daily} unit={unit} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="text-center py-4 text-xs text-muted-foreground/50">
          Powered by Open-Meteo · Built with ♥
        </footer>
      </div>
    </div>
  );
}
