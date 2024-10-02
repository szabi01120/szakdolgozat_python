import { useState, useEffect } from 'react';
import axios from 'axios';

const LatestCustomer = () => {
  const [latestCustomer, setLatestCustomer] = useState("");

  // minden frissüléskör lekérdezés
  useEffect(() => {
    axios.get("/api/sold_products/latest_customer")
      .then(response => {
        setLatestCustomer(response.data.customer_name);
      })
      .catch(error => {
        console.error("Hiba a lekérdezés során", error);
      });
  }, []);

  return (
    latestCustomer
  );
};

export default LatestCustomer;
