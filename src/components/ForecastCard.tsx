import { motion } from "framer-motion";
import { DailyForecast, getWeatherInfo, formatTemp } from "@/services/weatherApi";
import { Droplets } from "lucide-react";

interface ForecastProps {
  forecast: DailyForecast[];
  unit: "C" | "F";
}

export default function ForecastCard({ forecast, unit }: ForecastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {forecast.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode);
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en", { weekday: "short" });
          const dateStr = date.toLocaleDateString("en", { month: "short", day: "numeric" });

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <span className="text-xs font-semibold text-foreground">{dayName}</span>
              <span className="text-xs text-muted-foreground">{dateStr}</span>
              <span className="text-3xl my-1">{info.icon}</span>
              <div className="text-sm">
                <span className="font-bold text-foreground">{formatTemp(day.tempMax, unit)}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-muted-foreground">{formatTemp(day.tempMin, unit)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Droplets className="w-3 h-3" />
                {day.precipitationProbability}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
