import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { resetServerContext } from '@atlaskit/pragmatic-drag-and-drop';

// Good practice to reset server context for SSR.
resetServerContext();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
