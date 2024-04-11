import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("The element #portal wasn't found");
}

const root = createRoot(rootElement);

root.render(<App />);
