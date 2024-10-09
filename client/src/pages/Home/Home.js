import React, { useCallback } from 'react';
import Summary from './Summary';
import axios from 'axios';


export default function Home({ user }) {
  
  const logoutUser = useCallback(async () => {
    try {
      await axios.post('https://dezsanyilvantarto.hu:5000/api/logout', {}, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error("Hiba a kijelentkezéskor!", error);
    }
  }, []);

  return (
    <div>
      {user ? (
        <div className="container mt-4 pt-5 justify-content-center">
          <h1>Üdvözöllek, {user.name}!</h1>
          <Summary />
          <button onClick={logoutUser} className="btn btn-danger mt-4">Kijelentkezés</button>
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
      )
      }
    </div >
  );
}