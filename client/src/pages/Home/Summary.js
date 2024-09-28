import React from 'react';
import './Summary.css';
import SoldProductsSummary from './SoldProductsSummary';
import StockSummary from './StockSummary';
import TotalIncome from './TotalIncome';

const Summary = ({ latestProduct, latestCustomer, recentTransactions }) => {
  const { incomeHUF, incomeEUR, incomeUSD } = TotalIncome();

  const priceFormatter = new Intl.NumberFormat('hu-HU');

  return (
    <div className="summary-container">
      <div className="summary">
        {/* Bal oldali oszlop */}
        <div className="summary-column">
          <div className="summary-item">
            {/* Eladott termékek száma: */}
            <SoldProductsSummary />
          </div>
          <div className="summary-item">
            {/* Raktáron lévő termékek száma: */}
            <StockSummary />
          </div>
          <div className="summary-item">
            <h3>Jövedelem (HUF):</h3>
            <p>{priceFormatter.format(incomeHUF)} HUF</p>
          </div>
          <div className="summary-item">
            <h3>Jövedelem (EUR):</h3>
            <p>{priceFormatter.format(incomeEUR)} EUR</p>
          </div>
          <div className="summary-item">
            <h3>Jövedelem (USD):</h3>
            <p>{priceFormatter.format(incomeUSD)} USD</p>
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
