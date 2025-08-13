"use client";
import { useState, useEffect, createContext, useContext } from "react";

// Types
type Weather = {
  city: string;
  temp: number;
  condition: "Cloudy" | "Sunny" | "Rainy";
  wind: number;
  humidity: number;
  outfit: string;
};

type WeatherContextType = {
  weather: Weather | null;
  history: string[];
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  fetchWeather: (city: string) => Promise<void>;
  error: string | null;
  suggestions: string[];
  fetchSuggestions: (query: string) => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Mock API
const mockSuggestionsAPI = (query: string): string[] => {
  const cities = ["London", "Paris", "New York", "Tokyo", "Sydney", "Berlin", "Delhi", "Moscow"];
  return cities.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()));
};

// Real API
const OPENWEATHER_API_KEY = "2993d4f3569f74ec659a16583a123e8d"; // <-- Replace with your valid API key

const fetchWeatherAPI = async (city: string): Promise<Weather> => {
  // Correct endpoint for city name search
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  console.log("Fetching weather data from:", url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "City not found");
  }
  const data = await res.json();

  // Map OpenWeatherMap data to your Weather type
  const main = data.weather?.[0]?.main ?? "";
  const condition =
    main === "Rain"
      ? "Rainy"
      : main === "Clouds"
      ? "Cloudy"
      : "Sunny";

  let outfit = "Sunglasses suggested";
  if (condition === "Rainy") outfit = "Take an umbrella";
  else if (data.main.temp < 18) outfit = "Wear a jacket";

  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    condition,
    wind: Math.round(data.wind.speed),
    humidity: Math.round(data.main.humidity),
    outfit,
  };
};

// Context Provider
export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchWeather = async (city: string) => {
    setError(null);
    try {
      const data = await fetchWeatherAPI(city); // <-- use real API
      setWeather(data);
      setHistory((prev) => [data.city, ...prev.filter((c) => c !== data.city)].slice(0, 5));
    } catch (e: any) {
      setError(e.message || "Failed to fetch weather");
    }
  };

  const fetchSuggestions = (query: string) => {
    setSuggestions(query ? mockSuggestionsAPI(query) : []);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <WeatherContext.Provider value={{ weather, history, theme, setTheme, fetchWeather, error, suggestions, fetchSuggestions }}>
      {children}
    </WeatherContext.Provider>
  );
}

// Custom hook
export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("WeatherContext not found");
  return ctx;
};
