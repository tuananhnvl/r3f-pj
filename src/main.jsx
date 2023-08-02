import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Demo2 from './Demo2'
import Demo3 from './Demo3'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />} />
            <Route path="/demo2" element={<Demo2 />} />
            <Route path="/demo3" element={<Demo3 />} />
          
        </Routes>

    </BrowserRouter>
 
  </React.StrictMode>,
)
