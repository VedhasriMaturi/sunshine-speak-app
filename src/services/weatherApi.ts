export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface GeoLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const WEATHER_DESCRIPTIONS: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Rime Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Moderate Drizzle", icon: "🌦️" },
  55: { label: "Dense Drizzle", icon: "🌧️" },
  61: { label: "Slight Rain", icon: "🌧️" },
  63: { label: "Moderate Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Slight Snow", icon: "🌨️" },
  73: { label: "Moderate Snow", icon: "🌨️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  77: { label: "Snow Grains", icon: "❄️" },
  80: { label: "Slight Showers", icon: "🌦️" },
  81: { label: "Moderate Showers", icon: "🌧️" },
  82: { label: "Violent Showers", icon: "⛈️" },
  85: { label: "Slight Snow Showers", icon: "🌨️" },
  86: { label: "Heavy Snow Showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with Hail", icon: "⛈️" },
  99: { label: "Thunderstorm with Heavy Hail", icon: "⛈️" },
};

export function getWeatherInfo(code: number) {
  return WEATHER_DESCRIPTIONS[code] || { label: "Unknown", icon: "🌡️" };
}

export function getWeatherBackground(code: number, isDay: boolean): string {
  if (!isDay) return "";
  if (code === 0 || code === 1) return "weather-bg-clear";
  if (code <= 3 || code === 45 || code === 48) return "weather-bg-cloudy";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return "weather-bg-rainy";
  if (code >= 71 && code <= 86) return "weather-bg-snowy";
  return "weather-bg-cloudy";
}

export async function searchCity(query: string): Promise<GeoLocation[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  if (!res.ok) throw new Error("Failed to search cities");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No city found for "${query}"`);
  }
  return data.results.map((r: any) => ({
    name: r.name,
    country: r.country || "",
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeather(lat: number, lon: number, city: string, country: string): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=6`
  );
  if (!res.ok) throw new Error("Failed to fetch weather data");
  const data = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    daily: data.daily.time.slice(1).map((date: string, i: number) => ({
      date,
      tempMax: data.daily.temperature_2m_max[i + 1],
      tempMin: data.daily.temperature_2m_min[i + 1],
      weatherCode: data.daily.weather_code[i + 1],
      precipitationProbability: data.daily.precipitation_probability_max[i + 1],
    })),
    city,
    country,
    latitude: lat,
    longitude: lon,
  };
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(temp: number, unit: "C" | "F"): string {
  const value = unit === "F" ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit}`;
}

export function getVoiceMessage(city: string, temp: number, condition: string, unit: "C" | "F"): string {
  const t = formatTemp(temp, unit);
  let mood = "";
  const c = unit === "F" ? celsiusToFahrenheit(temp) : temp;
  const actualC = unit === "F" ? temp : temp; // temp is always in C from API
  if (actualC > 30) mood = "It's quite hot outside, stay hydrated!";
  else if (actualC > 20) mood = "It's a lovely day, perfect to go outside!";
  else if (actualC > 10) mood = "It's a bit cool, you might want a light jacket.";
  else if (actualC > 0) mood = "It's cold outside, bundle up warmly!";
  else mood = "It's freezing! Stay warm and be careful on the roads.";

  return `The weather in ${city} is currently ${t} with ${condition.toLowerCase()}. ${mood}`;
}
