import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Traffic.css';
import { Navbar } from '../../components';

export default function Traffic({ user }) {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Ár formázó létrehozása
  const priceFormatter = new Intl.NumberFormat('hu-HU');

  // SoldProducts lekérdezése
  useEffect(() => {
    if (productData) {
      axios
        .get('/api/sold_products')
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
        })
        .catch((error) => console.log('Hiba a termékek lekérdezésekor: ', error));
    }
  }, [productData]);

  // Termék adatok megjelenítésének kapcsolása
  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  // Checkbox állapot kezelése
  const handleCheckboxChange = (index) => {
    const updatedProducts = [...selectedProducts];
    if (updatedProducts.includes(index)) {
      updatedProducts.splice(updatedProducts.indexOf(index), 1); // Törli, ha már benne van
    } else {
      updatedProducts.push(index); // Hozzáadja, ha nincs benne
    }
    setSelectedProducts(updatedProducts);
  };

  // Kijelölt termékek törlése
  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      console.log('Nincs kijelölt termék.');
      return;
    }
    const confirmed = window.confirm("Biztosan törölni szeretnéd ezeket a termékeket?");
    if (confirmed) {
      try {
        await Promise.all(
          selectedProducts.map((id) =>
            axios.delete(`http://127.0.0.1:5000/api/delete_sold_product/${id}`)
          )
        );
        console.log('Sikeres törlés.');
        // A törölt termékek eltávolítása a listából
        setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
        setSelectedProducts([]); // Kiválasztott termékek listájának alaphelyzetbe állítása
      } catch (error) {
        console.log('Hiba történt a törlés közben: ', error);
      }
    } else {
      console.log('A törlés megszakítva.');
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="pt-4">
        <div className="container shadow d-flex flex-column pt-4">
          <h2>Forgalom</h2>
          <hr className="section-divider" />
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={handleProductsButtonClick}
            >
              Lekérdezés
            </button>
            <button
              type="button"
              className="btn btn-danger mb-3 ms-2"
              onClick={handleDeleteSelectedProducts}
            >
              Törlés
            </button>
          </div>
          {productData && (
            <div className="">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Terméknév</th>
                    <th>Bejövő számla</th>
                    <th>Kimenő számla</th>
                    <th>Típus</th>
                    <th>Méret</th>
                    <th>Mennyiség</th>
                    <th>Gyártó</th>
                    <th>Nettó ár</th>
                    <th>Eladás dátuma</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="11">Nincs termék adat</td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        <td>{product.product_name}</td>
                        <td>{product.incoming_invoice}</td>
                        <td>{product.outgoing_invoice}</td>
                        <td>{product.product_type}</td>
                        <td>{product.product_size}</td>
                        <td>{product.quantity} db</td>
                        <td>{product.manufacturer}</td>
                        <td>{priceFormatter.format(product.price)}</td>
                        <td>{product.date}</td> {/* Dátum megjelenítése */}
                        <td>
                          <input
                            className='product-checkbox'
                            type="checkbox"
                            id={`checkbox-select-${index}`}
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleCheckboxChange(product.id)}
                          />
                          <label htmlFor={`checkbox-select-${index}`}></label>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
