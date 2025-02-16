import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={backend}>
      <App />
    </DndProvider>
  </React.StrictMode>,
)
