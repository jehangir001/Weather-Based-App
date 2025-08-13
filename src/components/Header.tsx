"use client";
import { useWeather } from "../shared/DataContext";
import styles from "../app/page.module.scss";
import { IonButton, IonIcon, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useIonToast } from '@ionic/react';

// Button to switch between light and dark themes
function ThemeToggle() {
  const { theme, setTheme } = useWeather();
  const [presentToast] = useIonToast();

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Show popup message when theme changes
    presentToast({
      message: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      duration: 1000,
      position: 'top',
      color: newTheme === 'dark' ? 'dark' : 'light'
    });
  };

  return (
    <IonButton
      fill="clear"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
    >
      <IonIcon icon={theme === "light" ? sunny : moon} />
    </IonButton>
  );
}

// Main header with app title and theme toggle
export default function Header() {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle className="ion-text-center">Weather & Outfit App</IonTitle>
        <div slot="end">
          <ThemeToggle />
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
