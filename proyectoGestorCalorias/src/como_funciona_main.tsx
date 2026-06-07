import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ComoFunciona from './ComoFunciona'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComoFunciona />
  </StrictMode>,
)
