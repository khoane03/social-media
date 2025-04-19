import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRoute'
import { StompProvider } from './context/WsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StompProvider>
      <AppRouter />
    </StompProvider>
  </StrictMode>,
)
