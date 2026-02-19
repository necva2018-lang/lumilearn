import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { ShareProvider } from './contexts/ShareContext';
import { HeroCoverProvider } from './contexts/HeroCoverContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ShareProvider>
        <HeroCoverProvider>
          <App />
        </HeroCoverProvider>
      </ShareProvider>
    </ThemeProvider>
  </React.StrictMode>
);