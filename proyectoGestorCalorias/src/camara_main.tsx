import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Camara from './Camara'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Camara />
  </StrictMode>,
)
