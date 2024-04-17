import { useParams } from 'react-router-dom';
import { Navbar } from '..';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditProduct() {
    const params = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/termekek');
            if (response.status === 200) {
                setProducts(response.data);                
            }
        } catch (error) {
            console.error('Hiba', error);
        }
    }

    let currentProductName = "";
    let currentProductType = "";
    let currentProductSize = "";

    products.map((product) => {
        if (product.id.toString() === params.id) {
            currentProductName = product.termeknev;
            currentProductType = product.tipus;
            currentProductSize = product.meretek;
        }
        return product;
    });
    
    const types = ['Típus 1', 'Típus 2', 'Típus 3']; // Típusok listája

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name');
        const tipus = data.get('tipus');
        const meret = data.get('meret');

        try {
            const response = await axios.put(`http://localhost:5000/api/update_termek/${params.id}`, {
                termeknev: name,
                tipus: tipus,
                meretek: meret
            });
            if (response.status === 200) {
                alert('Sikeres szerkesztés!');
                window.location.href = '/termekek';
            }
        } catch (error) {
            console.error('Hiba', error);
        }
    };

    const productNameChange = event => {
        currentProductName = event.target.value;
    }

    return (
        <div>
            <Navbar />
            <div className='container mt-4 pt-5 d-flex justify-content-center'>
                <form className='border border-info-subtle border-3 p-5 shadow' onSubmit={handleSubmit}>
                    <h1 className='text-center'>Termék szerkesztés</h1>
                    <h5 className='text-center pt-2 pb-2'>Jelenleg ezt a terméket szerkeszted: {currentProductName}</h5>
                    <h6 className='text-center pt-1 pb-1'>Kérlek írd be az új adatokat!</h6>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Terméknév</label>
                        <input type="text" className="form-control"
                            name="name"
                            id="name"
                            placeholder={currentProductName}
                            onChange={productNameChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tipus" className="form-label">Típus</label>
                        <select className="form-select" id="tipus" name="tipus" placeholder={currentProductType} onChange={(e) => currentProductType = e.target.value} >
                            <option>{currentProductType}</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="meret" className="form-label">Méret</label>
                        <input type="text" className="form-control"
                            name="meret"
                            placeholder={currentProductSize}
                            id="meret"
                            onChange={(e) => currentProductSize = e.target.value}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Szerkesztés</button>
                </form>
            </div>
        </div>
    );
};
