import React from 'react';
import './Summary.css';
import SoldProductsSummary from './SoldProductsSummary';
import StockSummary from './StockSummary';
import TotalIncome from './TotalIncome';
import LatestSoldProduct from './LatestSoldProduct';
import LatestCustomer from './LatestCustomer';
import LastFiveCustomer from './LastFiveCustomer';

const Summary = () => {
  const { incomeHUF, incomeEUR, incomeUSD } = TotalIncome();
  const recentTransactions = LastFiveCustomer();

  const priceFormatter = new Intl.NumberFormat('hu-HU');
  const dateFormatter = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* felső container */}
      <div className="summary-container">
        <div className="summary">
          <div className="summary-column">
            <div className="summary-item">
              <p><SoldProductsSummary /></p>
            </div>
            <div className="summary-item">
              <p><StockSummary /></p>
            </div>
          </div>

          <div className="summary-column">
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

          <div className="summary-column">
            <div className="summary-item">
              <h3>Legutóbbi eladott termék:</h3>
              <p><LatestSoldProduct /></p>
            </div>
            <div className="summary-item">
              <h3>Legutóbbi vásárló neve:</h3>
              <p><LatestCustomer /></p>
            </div>
          </div>
        </div>
      </div>

      {/* alsó container*/}
      <div className="recent-customers-container">
        <div className="recent-customers">
          <h3>Utolsó 5 tranzakció:</h3>
          <ul>
            {recentTransactions.map((transaction, index) => (
              <li key={index}>
                <span className="transaction-date">
                  {dateFormatter.format(new Date(transaction.date))}
                </span> 
                <span className="transaction-product">{transaction.product_name}</span> 
                <span className="transaction-customer">{transaction.customer_name}</span>
                <span className="transaction-price">{transaction.price} {transaction.currency}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Summary;