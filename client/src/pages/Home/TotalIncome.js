import { useState, useEffect } from 'react';
import axios from 'axios';

const TotalIncome = () => {
    const [incomeHUF, setincomeHUF] = useState(0);
    const [incomeEUR, setincomeEUR] = useState(0);
    const [incomeUSD, setincomeUSD] = useState(0);

    // minden frissüléskör lekérdezés
    useEffect(() => {
        axios.get("/api/sold_products/income")
            .then(response => {
                setincomeHUF(response.data.total_income_huf);
                setincomeEUR(response.data.total_income_eur);
                setincomeUSD(response.data.total_income_usd);
            })
            .catch(error => {
                console.error("Hiba a lekérdezés során", error);
            });
    }, []);

    return { incomeHUF, incomeEUR, incomeUSD };    
};

export default TotalIncome;