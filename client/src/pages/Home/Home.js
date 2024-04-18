import React, { useState, useEffect } from 'react'
import { Navbar } from '../../components'
import './Home.css'
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState([""] || null);

  async function logoutUser() {
    try {
      await axios.post('http://localhost:5000/logout', { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error(error, "Hiba a kijelentkezéskor!");
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get('http://localhost:5000/active_user');
        console.log(resp.data);
        setUser(resp.data.username);
      } catch (error) {
        console.error(error, "Hiba a felhasználó azonosításakor!");
      }
      console.log("user: " + user);
    })();
  }, []);

  return (
    <div>
      <Navbar />
      {/* {user !== null ? ( */}
        {/* <div className="container mt-4 pt-5 justify-content-center">
          <h1>Üdvözöllek, {user.username}!</h1>
          <h1>Id: {user.id}</h1>
          <button onClick={logoutUser}>Kijelentkezés</button>
        </div> */}
      {/* ) : ( */}
        <div className="container mt-4 pt-5 justify-content-center">
          <p1>Azonosítsd magad</p1>
          <br />
          <a href='/login'>
            <button className="btn btn-primary">Bejelentkezés</button>
          </a>
        </div>
      {/* )} */}
    </div>
  )
}
