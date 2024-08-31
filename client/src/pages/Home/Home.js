import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components';
import './Home.css';
import axios from 'axios';

export default function Home({ user }) {
  const logoutUser = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      window.location.href = '/'; 
    } catch (error) {
      console.error("Hiba a kijelentkezéskor!", error);
    }
  }, []);

  return (
    <div>
      <Navbar user={user}/>
      {user ? (
        <div className="container mt-4 pt-5 justify-content-center">
          <h1>Üdvözöllek, {user.name}!</h1>
          <h1>Id: {user.id}</h1>
          <button onClick={logoutUser} className="btn btn-danger">Kijelentkezés</button>
        </div>
      ) : (
        <div className='container mt-4 pt-5 d-flex justify-content-center'>
          <form className='border border-info-subtle border-3 p-5 shadow'>
            <p>Azonosítsd magad</p>
            <br />
            <a href='/login'>
              <button type="button" className="btn btn-primary">Bejelentkezés</button>
            </a>
          </form>
        </div>
      )}
    </div>
  );
}
