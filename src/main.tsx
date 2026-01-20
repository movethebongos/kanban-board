import React from 'react'
import ReactDOM from 'react-dom/client'
import { KanbanBoard } from './features/board'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KanbanBoard />
  </React.StrictMode>,
)
