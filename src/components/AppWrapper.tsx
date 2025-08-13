"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { setupIonicReact } from '@ionic/react';

// Load Ionic components only on client (prevents server-side rendering issues)
const IonApp = dynamic(() => import('@ionic/react').then(mod => ({ default: mod.IonApp })), { ssr: false });
const IonPage = dynamic(() => import('@ionic/react').then(mod => ({ default: mod.IonPage })), { ssr: false });
const IonContent = dynamic(() => import('@ionic/react').then(mod => ({ default: mod.IonContent })), { ssr: false });

// Load our custom components only on client
const WeatherProvider = dynamic(() => import("../shared/DataContext").then(mod => ({ default: mod.WeatherProvider })), { ssr: false });
const Header = dynamic(() => import("./Header"), { ssr: false });
const Main = dynamic(() => import("./Main"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });

export default function AppWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Start Ionic framework when component loads
    setupIonicReact();
    setIsClient(true);
  }, []);

  // Show loading screen while app initializes
  if (!isClient) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        background: '#f5f5f5',
        color: '#333'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🌤️</div>
          <div>Loading Weather App...</div>
        </div>
      </div>
    );
  }

  // Main app structure with Ionic components
  return (
    <IonApp>
      <WeatherProvider>
        <IonPage>
          <Header />
          <IonContent>
            <Main />
            <Footer />
          </IonContent>
        </IonPage>
      </WeatherProvider>
    </IonApp>
  );
}
