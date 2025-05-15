
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Wrap the App in the necessary providers
root.render(<App />);

// Add a console log to confirm that main.tsx is loading correctly
console.log("Application initialized");
