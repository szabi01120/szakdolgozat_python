import React, { useCallback } from 'react';
import { Navbar } from '../../components';
import Summary from './Summary';
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

  const soldItems = 150; 
  const stockItems = 320;
  const incomeHUF = 2500000;
  const incomeEUR = 6500;

  return (
    <div>
      <Navbar user={user} />
      {user ? (
        <div className="container mt-4 pt-5 justify-content-center">
          <h1>Üdvözöllek, {user.name}!</h1>
          <Summary
            soldItems={soldItems}
            stockItems={stockItems}
            incomeHUF={incomeHUF}
            incomeEUR={incomeEUR}
            latestProduct={"Samsung Galaxy S21"}
            latestCustomer={"Kiss Péter"}
            recentTransactions={[
              { date: "2024-09-23", product: "iPhone 12", customer: "Nagy Anna", amount: 299000 },
              { date: "2024-09-22", product: "MacBook Pro", customer: "Kovács Dávid", amount: 899000 },
              { date: "2024-09-21", product: "Sony WH-1000XM4", customer: "Tóth Eszter", amount: 120000 },
              { date: "2024-09-20", product: "Samsung Galaxy Watch", customer: "Varga Tamás", amount: 95000 },
              { date: "2024-09-19", product: "Xiaomi Mi Band 6", customer: "Szabó Márk", amount: 15000 }
            ]}
          />
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
