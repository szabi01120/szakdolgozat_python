import { useParams } from 'react-router-dom';
import { Navbar } from '..';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProduct({ user }) {
    const params = useParams();
    const [products, setProducts] = useState([]);
    const [redirectToTermekek, setRedirectToTermekek] = useState(false); // termékek oldalra irányítás

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
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
            currentProductName = product.product_name;
            currentProductType = product.product_type;
            currentProductSize = product.product_size;
        }
        return product;
    });
    
    const types = ['Típus 1', 'Típus 2', 'Típus 3']; // Típusok listája

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = currentProductName;
        const type = currentProductType;
        const size = currentProductSize;

        try {
            const response = await axios.put(`http://localhost:5000/api/update_product/${params.id}`, {
                product_name: name,
                product_type: type,
                product_size: size
            });
        } catch (error) {
            console.error('Hiba', error);
        }
        alert('Sikeres szerkesztés! Az oldal frissítésre kerül.');
        setRedirectToTermekek(true);
    };

    const productNameChange = event => {
        currentProductName = event.target.value;
    }

    const productTypeChange = event => {
        currentProductType = event.target.value;
    }

    const productSizeChange = event => {
        currentProductSize = event.target.value;
    }

    if (redirectToTermekek) {
        return <Navigate to='/termekek' />;
    }

    return (
        <div>
            <Navbar user={user}/>
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
                        <label htmlFor="type" className="form-label">Típus</label>
                        <select className="form-select" id="type" name="type" placeholder={currentProductType} onChange={productTypeChange} >
                            <option>{currentProductType}</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="size" className="form-label">Méret</label>
                        <input type="text" className="form-control"
                            name="size"
                            placeholder={currentProductSize}
                            id="size"
                            onChange={productSizeChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Szerkesztés</button>
                </form>
            </div>
        </div>
    );
};
