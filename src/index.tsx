import React from 'react';
import ReactDOM from 'react-dom/client';
import { initZodI18n } from '@/shared/form/lib/zod-i18n';
import './index.css';
import { App } from './app';

initZodI18n();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
