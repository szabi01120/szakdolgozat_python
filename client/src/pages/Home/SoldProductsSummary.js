import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SoldProductsSummary = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  // minden frissüléskör lekérdezés
  useEffect(() => {
    axios.get("/api/sold_products/quantity")
      .then(response => {
        setTotalQuantity(response.data.total_quantity);
      })
      .catch(error => {
        console.error("Hiba a lekérdezés során", error);
      });
  }, []);

  return (
    <div className="sold-products-summary">
      <h3>Eladott termékek száma:</h3> {totalQuantity}
    </div>
  );
};

export default SoldProductsSummary;
