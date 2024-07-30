import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Termekek, Raktar, Ajanlat, Forgalom, NotFound, Login } from './pages';
import { AddProduct, EditProduct, ProductPhotos } from './components';
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
          <Route path="*" element={user ? <Navigate to="/" /> : <NotFound />} />
          <Route index element={<Home user={user}/>} />
          <Route path="/home" element={<Home user={user}/>} />
          <Route path="/termekek" element={user ? <Navigate to="/" /> : <Termekek user={user}/>} />
          <Route path="/forgalom" element={user ? <Navigate to="/" /> : <Forgalom user={user}/>} />
          <Route path="/raktar" element={user ? <Navigate to="/" /> : <Raktar user={user}/>} />
          <Route path="/ajanlat" element={user ? <Navigate to="/" /> : <Ajanlat user={user}/>} />
          <Route path="/addproduct" element={user ? <Navigate to="/" /> : <AddProduct user={user}/>} />
          <Route path="/editproduct/:id" element={user ? <Navigate to="/" /> : <EditProduct user={user}/>} />
          <Route path="/productphotos/:id" element={user ? <Navigate to="/" /> : <ProductPhotos user={user}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};
