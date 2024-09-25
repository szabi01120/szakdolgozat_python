import React, { useState, useEffect } from 'react';

const SoldProductsSummary = () => {  
  const [totalQuantity, setTotalQuantity] = useState(0);

  // minden frissüléskör lekérdezés
  useEffect(() => {
    fetch("/api/sold_products/quantity")
      .then(response => response.json())
      .then(data => {        
        const total = data.reduce((sum, product) => sum + product.quantity, 0);
        setTotalQuantity(total);
      })
      .catch(error => console.error("Hiba a lekérdezés során", error));
  }, []);

  return (
    <div className="sold-products-summary">
      <h3>Eladott termékek száma: </h3> {totalQuantity}
    </div>
  );
};

export default SoldProductsSummary;
