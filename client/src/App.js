import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Termekek, Raktar, Ajanlat, Forgalom, NotFound, Login } from './pages';
import { AddProduct, EditProduct, ProductPhotos } from './components';
import './App.css';

export default function App() {
  return (
    <div>      
      <BrowserRouter>
        <Routes>
          <Route path='/' exact component={<Home />} />
          <Route path='/login' exact element={<Login />} />
          <Route component={<NotFound />} />
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/termekek" element={<Termekek />} />
          <Route path="/forgalom" element={<Forgalom />} />
          <Route path="/raktar" element={<Raktar />} />
          <Route path="/ajanlat" element={<Ajanlat />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/productphotos/:id" element={<ProductPhotos />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};
