import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "../src/App"
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderCustom } from './context/ThemeContext';
import "./styles/index.css"
import SmallIcon from "./assets/images/SmallIcon.png"
import { Toaster } from './components/ui/sonner';

const link = document.querySelector("link[rel='icon']")
link.href = SmallIcon

// Default awal kesini
// const basename = import.meta.env.DEV ? "/chlora/" : "/"

// New basename test
const basename = "/"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ThemeProviderCustom>
          <Toaster position="top-right" expand={true} visibleToasts={3}/>
          <App />
        </ThemeProviderCustom>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);