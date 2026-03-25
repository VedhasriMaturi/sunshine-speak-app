import { motion } from "framer-motion";
import { Droplets, Wind, Thermometer, Volume2, VolumeX } from "lucide-react";
import { WeatherData, getWeatherInfo, formatTemp, getVoiceMessage } from "@/services/weatherApi";
import { useState, useCallback } from "react";

interface CurrentWeatherProps {
  data: WeatherData;
  unit: "C" | "F";
}

export default function CurrentWeatherCard({ data, unit }: CurrentWeatherProps) {
  const info = getWeatherInfo(data.current.weatherCode);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const msg = getVoiceMessage(data.city, data.current.temperature, info.label, unit);
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  }, [data, info, unit, speaking]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: temp + icon */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon />
            <span className="text-sm font-medium">{data.city}{data.country ? `, ${data.country}` : ""}</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              className="text-7xl sm:text-8xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {info.icon}
            </motion.span>
            <div>
              <p className="temp-display text-6xl sm:text-7xl">{formatTemp(data.current.temperature, unit)}</p>
              <p className="text-muted-foreground text-sm mt-1">Feels like {formatTemp(data.current.feelsLike, unit)}</p>
            </div>
          </div>
          <p className="text-lg font-medium text-foreground/80">{info.label}</p>
        </div>

        {/* Right: details */}
        <div className="flex flex-col gap-3 min-w-[160px]">
          <DetailRow icon={<Droplets className="w-4 h-4 text-primary" />} label="Humidity" value={`${data.current.humidity}%`} />
          <DetailRow icon={<Wind className="w-4 h-4 text-primary" />} label="Wind" value={`${Math.round(data.current.windSpeed)} km/h`} />
          <DetailRow icon={<Thermometer className="w-4 h-4 text-primary" />} label="Feels Like" value={formatTemp(data.current.feelsLike, unit)} />

          <button
            onClick={speak}
            className={`mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              speaking
                ? "bg-primary/20 text-primary animate-pulse_glow"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {speaking ? "Stop" : "Speak Weather"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-semibold text-foreground">{value}</span>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
