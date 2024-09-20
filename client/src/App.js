import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, AddProduct, Products, Quotation, Traffic, NotFound, Login } from './pages';
import { ProductPhotos } from './components';
import './App.css';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const resp = await axios.get('http://localhost:5000/@me', { withCredentials: true });
        setUser(resp.data);
      } catch (error) {
        setUser(null);
      }
    };
    checkUserSession();
  }, []);

  return (
    <div>      
      <BrowserRouter>
        <Routes>          
          <Route path='/' exact element={<Home user={user}/>} />
          <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="*" element={<NotFound />} />
          <Route index element={<Home user={user}/>} />
          <Route path="/home" element={<Home user={user}/>} />
          <Route path="/addproduct" element={user ? <AddProduct user={user}/> : <Navigate to="/" />} />
          <Route path="/forgalom" element={user ? <Traffic user={user}/> : <Navigate to="/" />} />
          <Route path="/raktar" element={user ? <Products user={user}/> : <Navigate to="/" />} />
          <Route path="/ajanlat" element={user ? <Quotation user={user}/> : <Navigate to="/" />} />
          <Route path="/productphotos/:id" element={user ? <ProductPhotos user={user}/> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};
