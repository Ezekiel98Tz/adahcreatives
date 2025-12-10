import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import './styles/theme.css'
import './styles/global.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

