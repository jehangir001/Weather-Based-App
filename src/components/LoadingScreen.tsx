"use client";
import { IonSpinner, IonContent, IonPage } from '@ionic/react';

export default function LoadingScreen() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '16px'
        }}>
          <IonSpinner name="crescent" />
          <h2>Loading Weather App...</h2>
        </div>
      </IonContent>
    </IonPage>
  );
}
