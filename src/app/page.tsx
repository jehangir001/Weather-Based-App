"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import { WeatherProvider, useWeather } from "../shared/DataContext";

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
