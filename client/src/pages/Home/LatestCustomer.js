import { useState, useEffect } from 'react';
import axios from 'axios';

const LatestCustomer = () => {
  const [latestCustomer, setLatestCustomer] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/sold_products/latest_customer")
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
