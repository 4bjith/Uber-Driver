import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import DriverDashboard from './pages/DriverDashboard'
import DashBoard from './pages/DashBoard'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter/> */}
    <DashBoard/>
  </StrictMode>,
)
