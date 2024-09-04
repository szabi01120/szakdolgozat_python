import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';
import { Navbar } from '../../components';

export default function Products({ user }) {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsToMove, setProductsToMove] = useState([]);

  const priceFormatter = new Intl.NumberFormat('hu-HU');

  useEffect(() => {
    axios.get('/api/products')
      .then(async response => {
        const storedStates = JSON.parse(localStorage.getItem('productsStates')) || {};
        const productsWithPhotos = await Promise.all(response.data.map(async (product) => {
          try {
            const photoResponse = await axios.get(`http://127.0.0.1:5000/api/images/${product.id}`);
            product.hasPhotos = photoResponse.data.length > 0;
          } catch (error) {
            console.log('Hiba a képek lekérdezésekor: ', error);
            product.hasPhotos = false;
          }

          // Alapértelmezett értékek beállítása, ha nincs mentett állapot
          product.sold = storedStates[product.id]?.sold || false;
          product.shipped = storedStates[product.id]?.shipped || false;

          return product;
        }));
        setProducts(productsWithPhotos);
      })
      .catch(error => console.log('Hiba a termékek lekérdezésekor: ', error));
  }, []);

  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_product/${id}`);
      if (response.status === 200) {
        console.log('Sikeres törlés');
        setProducts(products.filter(product => product.id !== id));
        // Törölni kell a terméket a localStorage-ból is
        const storedStates = JSON.parse(localStorage.getItem('productsStates')) || {};
        delete storedStates[id];
        localStorage.setItem('productsStates', JSON.stringify(storedStates));
      } else {
        console.log('Sikertelen törlés');
      }
    } catch (error) {
      console.log('Hiba történt a törlés közben: ', error);
    }
  };

  const handleCheckboxChange = (index, field) => {
    const updatedProductsCopy = [...products];
    const product = updatedProductsCopy[index];
    product[field] = !product[field];
  
    // Állapotok mentése localStorage-ba
    const storedStates = JSON.parse(localStorage.getItem('productsStates')) || {};
    const productId = product.id;
  
    // Ha mindkét checkbox false, töröljük az elemet a localStorage-ból
    if (!product.sold && !product.shipped) {
      delete storedStates[productId];
    } else {
      // Egyébként mentjük az aktuális állapotokat
      storedStates[productId] = {
        sold: product.sold,
        shipped: product.shipped,
      };
    }
  
    localStorage.setItem('productsStates', JSON.stringify(storedStates));
  
    // Checkbox kezelésének logikája
    if (field === 'sold' || field === 'shipped') {
      const bothChecked = product.sold && product.shipped;
  
      if (bothChecked) {
        if (!productsToMove.includes(product.id)) {
          setProductsToMove([...productsToMove, product.id]);
        }
      } else {
        setProductsToMove(productsToMove.filter(id => id !== product.id));
      }
    }
  
    setProducts(updatedProductsCopy);
  };
  

  const handleSaveButtonClick = async () => {
    if (productsToMove.length > 0) {
      try {
        const response = await axios.post('/api/update_product_status', productsToMove);
        if (response.status === 200) {
          console.log('Sikeres módosítás');

          // Frissítjük a localStorage-t is
          const storedStates = JSON.parse(localStorage.getItem('productsStates')) || {};

          // Töröljük a localStorage-ból azokat az elemeket, amelyek már nem léteznek a products tömbben
          productsToMove.forEach(id => {
            delete storedStates[id];
          });

          localStorage.setItem('productsStates', JSON.stringify(storedStates));

          // Termékek eltávolítása a products listából
          setProducts(products.filter(product => !productsToMove.includes(product.id)));
          setProductsToMove([]); // Reset the moved products list
        } else {
          console.log('Sikertelen módosítás');
        }
      } catch (error) {
        console.log('Hiba történt a módosítás közben: ', error);
      }
    } else {
      console.log('Nincs termék a feltételekhez');
    }
  };


  return (
    <div>
      <Navbar user={user} />
      <div className="pt-4">
        <div className="container shadow d-flex flex-column pt-4">
          <h2>Termékek</h2>
          <hr className="section-divider" />
          <div className="d-flex">
            <button type="button" className="btn btn-primary mb-3" onClick={handleProductsButtonClick}>
              Lekérdezés
            </button>
            <Link to="/addproduct" type="button" className="btn btn-primary mb-3">
              Termék hozzáadása
            </Link>
            <button type="button" className="btn btn-edit mb-3" onClick={handleSaveButtonClick}>
              Mentés
            </button>
          </div>
          {productData &&
            <div className="">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th scope="productName">Terméknév</th>
                    <th scope="incomingInvoice">Bejövő számla</th>
                    <th scope="productType">Típus</th>
                    <th scope="productSize">Méret</th>
                    <th scope="quantity">Mennyiség</th>
                    <th scope="manufacturer">Gyártó</th>
                    <th scope="price">Nettó ár</th>
                    <th scope="sold">Eladva?</th>
                    <th scope="shipped">Szállítva?</th>
                    <th scope="operations">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="10">Nincs termék adat</td></tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        <td>{product.product_name}</td>
                        <td>{product.incoming_invoice}</td>
                        <td>{product.product_type}</td>
                        <td>{product.product_size}</td>
                        <td>{product.quantity} db</td>
                        <td>{product.manufacturer}</td>
                        <td>{priceFormatter.format(product.price)}</td>
                        <td>
                          <input
                            type="checkbox"
                            id={`checkbox-sold-${index}`}
                            checked={product.sold || false}
                            onChange={() => handleCheckboxChange(index, 'sold')}
                          />
                          <label htmlFor={`checkbox-sold-${index}`}></label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id={`checkbox-shipped-${index}`}
                            checked={product.shipped || false}
                            onChange={() => handleCheckboxChange(index, 'shipped')}
                          />
                          <label htmlFor={`checkbox-shipped-${index}`}></label>
                        </td>
                        <td>
                          <button className="btn btn-danger me-2" onClick={() => handleDeleteButtonClick(product.id)}>
                            Törlés
                          </button>
                          <Link to={`/editproduct/${product.id}`} type="button" className="btn btn-edit me-2">
                            Edit
                          </Link>
                          {product.hasPhotos && (
                            <Link to={`/productphotos/${product.id}`} type="button" className="btn btn-photo">
                              Fotók
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
