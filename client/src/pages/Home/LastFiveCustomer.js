import { useState, useEffect } from 'react';
import axios from 'axios';

const LastFiveCustomer = () => {
  const [lastFiveCustomers, setLastFiveCustomers] = useState([]);

  useEffect(() => {
    axios.get("https://dezsanyilvantarto.hu/api/sold_products/last_five_customer")
      .then(response => {
        setLastFiveCustomers(response.data.last_five_customers);
      },)
      .catch(error => {
        console.error("Hiba a lekérdezés során", error);
      });
  }, []);

  return (
    lastFiveCustomers
  );
};

export default LastFiveCustomer;
