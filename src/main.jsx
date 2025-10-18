import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DashBoard from './pages/DashBoard'
import Router from "./Router"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router/>
  </StrictMode>,
)
