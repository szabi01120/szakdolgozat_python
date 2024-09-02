import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';
import { Navbar } from '../../components';

export default function Products({ user }) {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([{}]);
  const [updatedProducts, setUpdatedProducts] = useState([]);

  // Ár formázó létrehozása
  const priceFormatter = new Intl.NumberFormat('hu-HU');

  // termékek lekérdezése
  useEffect(() => {
    axios.get("/api/products")
      .then(async response => {
        const productsWithPhotos = await Promise.all(response.data.map(async (product) => {
          try {
            // megnézi van-e kép a termékhez
            const photoResponse = await axios.get(`http://127.0.0.1:5000/api/images/${product.id}`);
            product.hasPhotos = photoResponse.data.length > 0;
          } catch (error) {
            console.log("Hiba a képek lekérdezésekor: ", error);
            product.hasPhotos = false;
          }
          console.log("products: ", response.data);
          return product;
        }));
        setProducts(productsWithPhotos);
      })
      .catch(error => console.log("Hiba a termékek lekérdezésekor: ", error));
  }, []);

  // Termék adatok megjelenítésének kapcsolása
  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  // Termék törlése
  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_product/${id}`);
      if (response.status === 200) {
        console.log('Sikeres törlés');
        // A törölt termék eltávolítása a listából
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
      } else {
        console.log('Sikertelen törlés');
      }
    } catch (error) {
      console.log("Hiba történt a törlés közben: ", error);
    }
  };

  // Checkbox állapot kezelése és frissítendő termékek hozzáadása
  const handleCheckboxChange = (index, field) => {
    const updatedProductsCopy = [...products];
    updatedProductsCopy[index][field] = !updatedProductsCopy[index][field];
    setProducts(updatedProductsCopy);

    // Frissítendő termékek azonosítása
    const product = updatedProductsCopy[index];
    if (product.sold || product.shipped) {
      setUpdatedProducts((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        if (exists) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, [field]: product[field] } : p
          );
        } else {
          return [...prev, { id: product.id, sold: product.sold, shipped: product.shipped }];
        }
      });
    } else {
      setUpdatedProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };
  console.log("updatedproducts: ", updatedProducts);

  // Mentés gomb kezelése
  const handleSaveButtonClick = async () => {
    for (const product of updatedProducts) {
      if (product.sold && product.shipped) {
        try {
          const response = await axios.post(`/api/update_product_status/${product.id}`, {
            sold: product.sold,
            shipped: product.shipped
          });
          if (response.status === 200) {
            console.log('Sikeres módosítás');
          } else {
            console.log('Sikertelen módosítás');
          }
        } catch (error) {
          console.log("Hiba történt a módosítás közben: ", error);
        }
      }
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="pt-4">
        <div className="container shadow d-flex flex-column pt-4">
          <h2 céas>Termékek</h2>
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
                        <td>{priceFormatter.format(product.price)}</td> {/* Ár formázás */}
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
