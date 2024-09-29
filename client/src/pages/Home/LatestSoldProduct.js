import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SoldProductsSummary = () => {
  const [latestSoldProduct, setLatestSoldProduct] = useState(0);

  // minden frissüléskör lekérdezés
  useEffect(() => {
    axios.get("/api/sold_products/latest")
      .then(response => {
        setLatestSoldProduct(response.data.product_name);
      })
      .catch(error => {
        console.error("Hiba a lekérdezés során", error);
      });
  }, []);

  return (
    latestSoldProduct
  );
};

export default SoldProductsSummary;
