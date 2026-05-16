/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Indigo 600
        'on-primary': "#ffffff",
        'primary-container': "#e0e7ff", // Indigo 100
        'on-primary-container': "#312e81", // Indigo 900
        'primary-fixed': "#e0e7ff",
        'primary-fixed-dim': "#c7d2fe",
        'on-primary-fixed': "#312e81",
        
        secondary: "#0ea5e9", // Sky 500
        tertiary: "#8b5cf6", // Violet 500
        'tertiary-fixed': '#ede9fe',
        'on-tertiary-fixed-variant': '#5b21b6',
        
        error: "#ef4444", // Red 500
        'error-container': "#fee2e2",
        'on-error-container': "#7f1d1d",
        
        surface: "#f8fafc", // Slate 50
        'on-surface': "#0f172a", // Slate 900
        'on-surface-variant': "#475569", // Slate 600
        
        'surface-container-lowest': "#ffffff",
        'surface-container-low': "#f8fafc",
        'surface-container': "#f1f5f9",
        'surface-container-high': "#e2e8f0",
        'surface-container-highest': "#cbd5e1",
        
        outline: "#94a3b8", // Slate 400
        'outline-variant': "#cbd5e1", // Slate 300
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
