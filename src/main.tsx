import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirebaseConnection } from './firebase/testConnection';

testFirebaseConnection().catch((error) => {
  console.error('Erro ao conectar ao Firebase:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
