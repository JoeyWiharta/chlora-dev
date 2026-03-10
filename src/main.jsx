import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "../src/App"
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderCustom } from './context/ThemeContext';
import "./styles/index.css"
import { ToasterCustom } from './components/common/ToasterCustom';
import SmallIcon from "./assets/images/SmallIcon.png"

const link = document.querySelector("link[rel='icon']")
link.href = SmallIcon

const basename = import.meta.env.DEV ? "/chlora/" : "/chlora/"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ThemeProviderCustom>
          <ToasterCustom />
          <App />
        </ThemeProviderCustom>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);