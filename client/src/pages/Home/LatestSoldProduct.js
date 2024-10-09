import { useState, useEffect } from 'react';
import axios from 'axios';

const SoldProductsSummary = () => {
  const [latestSoldProduct, setLatestSoldProduct] = useState("");

  useEffect(() => {
    axios.get("https://dezsanyilvantarto.hu:5000/api/sold_products/latest")
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
