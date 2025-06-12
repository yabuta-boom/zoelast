import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FirebaseProvider } from './components/FirebaseProvider';
import { AuthProvider } from './components/auth/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <FirebaseProvider>
          <AuthProvider>
            <MessageProvider>
              <App />
            </MessageProvider>
          </AuthProvider>
        </FirebaseProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);