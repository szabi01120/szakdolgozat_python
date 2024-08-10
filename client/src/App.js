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
          <Route path="*" element={<NotFound />} />
          <Route index element={<Home user={user}/>} />
          <Route path="/home" element={<Home user={user}/>} />
          <Route path="/termekek" element={user ? <Termekek user={user}/> : <Navigate to="/" />} />
          <Route path="/forgalom" element={user ? <Forgalom user={user}/> : <Navigate to="/" />} />
          <Route path="/raktar" element={user ? <Raktar user={user}/> : <Navigate to="/" />} />
          <Route path="/ajanlat" element={user ? <Ajanlat user={user}/> : <Navigate to="/" />} />
          <Route path="/addproduct" element={user ? <AddProduct user={user}/> : <Navigate to="/" />} />
          <Route path="/editproduct/:id" element={user ? <EditProduct user={user}/> : <Navigate to="/" />} />
          <Route path="/productphotos/:id" element={user ? <ProductPhotos user={user}/> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};
