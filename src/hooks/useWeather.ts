import { useState, useEffect, useCallback } from "react";
import { WeatherData, searchCity, fetchWeather } from "@/services/weatherApi";

const RECENT_KEY = "weather_recent_searches";
const MAX_RECENT = 5;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addRecent = useCallback((city: string) => {
    setRecentSearches((prev) => {
      const next = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const searchByCity = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const locations = await searchCity(query);
      const loc = locations[0];
      const data = await fetchWeather(loc.latitude, loc.longitude, loc.name, loc.country);
      setWeather(data);
      addRecent(loc.name);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [addRecent]);

  const searchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
      );
      let city = "Your Location";
      let country = "";
      if (res.ok) {
        const geo = await res.json();
        if (geo.results?.[0]) {
          city = geo.results[0].name;
          country = geo.results[0].country || "";
        }
      }
      const data = await fetchWeather(lat, lon, city, country);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Failed to get weather for your location");
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => searchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setLoading(false);
        // Fallback to a default city
        searchByCity("London");
      },
      { timeout: 8000 }
    );
  }, [searchByCoords, searchByCity]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return { weather, loading, error, searchByCity, detectLocation, recentSearches };
}
