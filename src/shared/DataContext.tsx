"use client";
import { useState, useEffect, createContext, useContext } from "react";

// Define weather data structure
type Weather = {
  city: string;
  temp: number;
  condition: "Cloudy" | "Sunny" | "Rainy";
  wind: number;
  humidity: number;
  outfit: string;
};

// Define context interface
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

// Create React context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Mock city suggestions for search
const mockSuggestionsAPI = (query: string): string[] => {
  const cities = ["London", "Paris", "New York", "Tokyo", "Sydney", "Berlin", "Delhi", "Moscow"];
  return cities.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()));
};

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = "2993d4f3569f74ec659a16583a123e8d"; // <-- Replace with your valid API key

// Fetch weather data from OpenWeatherMap API
const fetchWeatherAPI = async (city: string): Promise<Weather> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  console.log("Fetching weather data from:", url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "City not found");
  }
  const data = await res.json();

  // Convert API weather condition to our format
  const main = data.weather?.[0]?.main ?? "";
  const condition =
    main === "Rain"
      ? "Rainy"
      : main === "Clouds"
      ? "Cloudy"
      : "Sunny";

  // Suggest outfit based on weather
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

// Main provider component that manages all app state
export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch weather data for a city
  const fetchWeather = async (city: string) => {
    setError(null);
    try {
      const data = await fetchWeatherAPI(city);
      setWeather(data);
      // Add city to history (keep last 5 cities)
      setHistory((prev) => [data.city, ...prev.filter((c) => c !== data.city)].slice(0, 5));
    } catch (e: any) {
      setError(e.message || "Failed to fetch weather");
    }
  };

  // Get city suggestions for search
  const fetchSuggestions = (query: string) => {
    setSuggestions(query ? mockSuggestionsAPI(query) : []);
  };

  // Update theme when it changes
  useEffect(() => {
    // Set theme attribute for CSS
    document.body.setAttribute("data-theme", theme);
    
    // Update Ionic theme classes
    document.body.classList.remove('ion-color-light', 'ion-color-dark');
    document.body.classList.add(`ion-color-${theme}`);
    
    // Update document theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update browser theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }, [theme]);

  return (
    <WeatherContext.Provider value={{ weather, history, theme, setTheme, fetchWeather, error, suggestions, fetchSuggestions }}>
      {children}
    </WeatherContext.Provider>
  );
}

// Hook to use weather context in components
export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("WeatherContext not found");
  return ctx;
};
