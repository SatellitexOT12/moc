// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // ← Importante: carga Tailwind y tus estilos personalizados
import { AuthProvider } from './context/AuthContext'; // ← Importa tu AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ Aquí envolvemos */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


