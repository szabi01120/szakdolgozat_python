import React from 'react';
import './Summary.css';
import '../../App.css';
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
              <div><SoldProductsSummary /></div>
            </div>
            <div className="summary-item">
              <div><StockSummary /></div>
            </div>
          </div>

          <div className="summary-column">
            <div className="summary-item">
              <h3>Profit (HUF):</h3>
              <p className={incomeHUF >= 0 ? 'profit-summary-green' : 'profit-summary-red'}>
                {priceFormatter.format(incomeHUF)} HUF
              </p>
            </div>
            <div className="summary-item">
              <h3>Profit (EUR):</h3>
              <p className={incomeEUR >= 0 ? 'profit-summary-green' : 'profit-summary-red'}>
                {priceFormatter.format(incomeEUR)} EUR
              </p>
            </div>
            <div className="summary-item">
              <h3>Profit (USD):</h3>
              <p className={incomeUSD >= 0 ? 'profit-summary-green' : 'profit-summary-red'}>
                {priceFormatter.format(incomeUSD)} USD
              </p>
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
            <li className='transaction-header'>
              <span className="transaction-date">Dátum</span>
              <span className="transaction-product">Termék neve</span>
              <span className="transaction-customer">Vásárló neve</span>
              <span className="transaction-price">Eladási ár</span>
            </li>
            {recentTransactions?.map((transaction, index) => (
              <li key={index}>
                <span className="transaction-date">
                  {dateFormatter.format(new Date(transaction.date))}
                </span>
                <span className="transaction-product">{transaction.product_name}</span>
                <span className="transaction-customer">{transaction.customer_name}</span>
                <span className="transaction-price">{priceFormatter.format(transaction.selling_price)} {transaction.currency}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Summary;