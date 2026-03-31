import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Outputmain from './Outputmain.tsx'
import { Counter } from './Counter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Outputmain />
  </StrictMode>,
)
