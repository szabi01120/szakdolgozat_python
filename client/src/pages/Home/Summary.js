import React from 'react';
import './Summary.css';

const Summary = ({ user, soldItems, stockItems, incomeHUF, incomeEUR, latestProduct, latestCustomer, recentTransactions }) => {
  return (
    <div className="summary-container">
      <div className="summary">
        {/* Bal oldali oszlop */}
        <div className="summary-column">
          <div className="summary-item">
            <h3>Eladott termékek száma:</h3>
            <p>{soldItems}</p>
          </div>
          <div className="summary-item">
            <h3>Raktáron lévő termékek száma:</h3>
            <p>{stockItems}</p>
          </div>
          <div className="summary-item">
            <h3>Jövedelem (HUF):</h3>
            <p>{incomeHUF} HUF</p>
          </div>
          <div className="summary-item">
            <h3>Jövedelem (EUR):</h3>
            <p>{incomeEUR} EUR</p>
          </div>
        </div>
        {/* Jobb oldali oszlop */}
        <div className="summary-column">
          <div className="summary-item">
            <h3>Legutóbbi eladott termék:</h3>
            <p>{latestProduct}</p>
          </div>
          <div className="summary-item">
            <h3>Legutóbbi vásárló neve:</h3>
            <p>{latestCustomer}</p>
          </div>
          <div className="summary-item">
            <h3>Utolsó 5 tranzakció:</h3>
            <ul>
              {recentTransactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.date} - {transaction.product} ({transaction.customer}) - {transaction.amount} HUF
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
