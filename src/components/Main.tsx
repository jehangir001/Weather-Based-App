"use client";
import { useState, useRef } from "react";
import { useWeather } from "../shared/DataContext";
import styles from "../app/page.module.scss";
import { 
  IonSearchbar, 
  IonButton, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonBadge
} from '@ionic/react';
import { 
  search, 
  location, 
  thermometer, 
  water, 
  speedometer, 
  sunny, 
  cloudy, 
  rainy,
  umbrella,
  glasses,
  shirt
} from 'ionicons/icons';

// Search component for finding cities
function CitySearch() {
  const { fetchWeather, fetchSuggestions, suggestions, error } = useWeather();
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search input changes with delay
  const handleChange = (e: CustomEvent) => {
    const value = e.detail.value || "";
    setInput(value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  // Select a city from suggestions
  const handleSelect = (city: string) => {
    setInput(city);
    setShowSuggestions(false);
    fetchWeather(city);
  };

  // Submit search
  const handleSubmit = () => {
    if (input.trim()) fetchWeather(input.trim());
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonSearchbar
          value={input}
          onIonInput={handleChange}
          placeholder="Type a city name..."
          showClearButton="focus"
          animated={true}
          debounce={300}
        />
        
        <IonButton 
          expand="block" 
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="ion-margin-top"
        >
          <IonIcon icon={location} slot="start" />
          Search Weather
        </IonButton>

        {/* Show city suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <IonList className="ion-margin-top">
            {suggestions.map((city) => (
              <IonItem 
                key={city} 
                button 
                onClick={() => handleSelect(city)}
                lines="full"
              >
                <IonIcon icon={location} slot="start" />
                <IonLabel>{city}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        
        {/* Show error message */}
        {error && (
          <IonChip color="danger" className="ion-margin-top">
            <IonIcon icon={location} />
            <IonLabel>{error}</IonLabel>
          </IonChip>
        )}
      </IonCardContent>
    </IonCard>
  );
}

// Display weather information for selected city
function WeatherDisplay() {
  const { weather } = useWeather();
  if (!weather) return null;

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny': return sunny;
      case 'Cloudy': return cloudy;
      case 'Rainy': return rainy;
      default: return sunny;
    }
  };

  // Get outfit icon based on suggestion
  const getOutfitIcon = (outfit: string) => {
    if (outfit.includes('umbrella')) return umbrella;
    if (outfit.includes('Sunglasses')) return glasses;
    if (outfit.includes('jacket')) return shirt;
    return sunny;
  };

  return (
    <IonCard className="ion-margin-top">
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={location} /> {weather.city}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          {/* Weather condition display */}
          <IonRow class="c-weather-condition">
            <IonCol size="12" className="ion-text-center">
              <IonIcon icon={getWeatherIcon(weather.condition)} size="large" />
              <h2>{weather.condition}</h2>
            </IonCol>
          </IonRow>
          {/* Temperature and wind info */}
          <IonRow>
            <IonCol size="6">
              <IonItem lines="none">
                <IonIcon icon={thermometer} slot="start" />
                <IonLabel>
                  <h3>Temperature</h3>
                  <p>{weather.temp}°C</p>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="none">
                <IonIcon icon={speedometer} slot="start" />
                <IonLabel>
                  <h3>Wind</h3>
                  <p>{weather.wind} km/h</p>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          {/* Humidity and outfit info */}
          <IonRow>
            <IonCol size="6">
              <IonItem lines="none">
                <IonIcon icon={water} slot="start" />
                <IonLabel>
                  <h3>Humidity</h3>
                  <p>{weather.humidity}%</p>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="none">
                <IonIcon icon={getOutfitIcon(weather.outfit)} slot="start" />
                <IonLabel>
                  <h3>Outfit</h3>
                  <p>{weather.outfit}</p>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

// Show list of recently searched cities
function History() {
  const { history, fetchWeather } = useWeather();
  if (!history.length) return null;
  return (
    <IonCard className="ion-margin-top">
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={location} /> Recent Cities
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {history.map((city) => (
            <IonItem 
              key={city} 
              button 
              onClick={() => fetchWeather(city)}
              lines="full"
            >
              <IonIcon icon={location} slot="start" />
              <IonLabel>{city}</IonLabel>
              <IonButton 
                fill="clear" 
                slot="end"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchWeather(city);
                }}
              >
                <IonIcon icon={search} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}

// Main content area with all components
export default function Main() {
  return (
    <div className="ion-padding">
      <CitySearch />
      <WeatherDisplay />
      <History />
    </div>
  );
}
