import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { stor } from './Services/App/Stor.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={stor}>
      <App />
    </Provider>
  </StrictMode>
);
