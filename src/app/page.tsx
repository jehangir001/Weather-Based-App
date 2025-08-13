"use client";
import dynamic from "next/dynamic";

// Dynamically import the entire app with no SSR
const AppWrapper = dynamic(() => import("../components/AppWrapper"), { 
  ssr: false,
  loading: () => (
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
  )
});

// Main Page
export default function Home() {
  return <AppWrapper />;
}
