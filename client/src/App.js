import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddProduct, Home, Termekek, Raktar, Ajanlat } from './pages';
import './App.css';

export default function App() {
  return (
    <div>      
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/termekek" element={<Termekek />} />
          <Route path="/raktar" element={<Raktar />} />
          <Route path="/ajanlat" element={<Ajanlat />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};
