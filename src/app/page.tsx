"use client";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import styles from "./page.module.scss";

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
const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // <-- Replace with your API key

const fetchWeatherAPI = async (city: string): Promise<Weather> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found");
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
function WeatherProvider({ children }: { children: React.ReactNode }) {
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
const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("WeatherContext not found");
  return ctx;
};

// Components
function CitySearch() {
  const { fetchWeather, fetchSuggestions, suggestions, error } = useWeather();
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 300);
  };

  const handleSelect = (city: string) => {
    setInput(city);
    setShowSuggestions(false);
    fetchWeather(city);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) fetchWeather(input.trim());
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type a city name..."
        className={styles.searchInput}
        autoComplete="off"
        aria-label="City name"
      />
      <button type="submit" className={styles.searchBtn}>Search</button>
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((city) => (
            <li key={city} onClick={() => handleSelect(city)}>{city}</li>
          ))}
        </ul>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}

function WeatherDisplay() {
  const { weather } = useWeather();
  if (!weather) return null;
  return (
    <div className={`${styles.weatherCard} ${styles.animate}`}>
      <h2>{weather.city}</h2>
      <div className={styles.weatherInfo}>
        <span>Temperature: {weather.temp}°C</span>
        <span>Condition: {weather.condition}</span>
        <span>Wind: {weather.wind} km/h</span>
        <span>Humidity: {weather.humidity}%</span>
      </div>
      <div className={styles.outfit}>{weather.outfit}</div>
    </div>
  );
}

function History() {
  const { history, fetchWeather } = useWeather();
  if (!history.length) return null;
  return (
    <div className={styles.history}>
      <h3>Recent Cities</h3>
      <ul>
        {history.map((city) => (
          <li key={city}>
            <button onClick={() => fetchWeather(city)}>{city}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useWeather();
  return (
    <button
      className={styles.themeToggle}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
}

// Main Page
export default function Home() {
  return (
    <WeatherProvider>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Weather & Outfit App</h1>
          <ThemeToggle />
        </header>
        <main className={styles.main}>
          <CitySearch />
          <WeatherDisplay />
          <History />
        </main>
        <footer className={styles.footer}>
          <span>Weather data is mocked. Demo app.</span>
        </footer>
      </div>
    </WeatherProvider>
  );
}
