import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockSummary = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    axios.get("https://hajnalszabolcs.duckdns.org:5000/api/products/quantity")
      .then(response => {
        setTotalQuantity(response.data.total_quantity);
      })
      .catch(error => {
        console.error("Hiba a lekérdezés során", error);
      });
  }, []);

  return (
    <div className="sold-products-summary">
      <h3>Raktáron lévő termékek száma:</h3> {totalQuantity}
    </div>
  );
};

export default StockSummary;