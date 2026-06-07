import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import AppRouter from './Router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/DIW">
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)
