import React, { useState, useEffect } from 'react'
import { Navbar } from '../../components'
import './Home.css'
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get('http://localhost:5000/@me');
        setUser(resp.data);
      } catch (error) {
        console.error(error, "Hiba a felhasználó azonosításakor!");
      }
    })();
  });

  return (
    <div>
      <Navbar />
      {user != null ? (
        <div className="container mt-4 pt-5 justify-content-center">
          <h1>Üdvözöllek, {user.user}!</h1>
        </div>
      ) : (
        <div className="container mt-4 pt-5 justify-content-center">
        <p1>Azonosítsd magad</p1>
        <br />
        <a href='/login'>
          <button className="btn btn-primary">Bejelentkezés</button>
        </a>
      </div>
      )}
    </div>
  )
}
