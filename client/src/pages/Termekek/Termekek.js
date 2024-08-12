import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Termekek.css';
import { Navbar } from '../../components';

export default function Termekek({ user }) {

  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([{}]);

  // termékek lekérdezése
  useEffect(() => {
    axios.get("/api/products")
      .then(async response => {
        const productsWithPhotos = await Promise.all(response.data.map(async (product) => {
          try {
            // megnézi van e kép a termékhez
            const photoResponse = await axios.get(`http://127.0.0.1:5000/api/images/${product.id}`);
            if (photoResponse.data.length > 0) {
              product.hasPhotos = true;
            } else {
              product.hasPhotos = false;
            }
          } catch (error) {
            console.log("Hiba a képek lekérdezésekor: ", error);
          }
          return product;
        }));
        setProducts(productsWithPhotos);
      })
      .catch(error => console.log("Hiba a termékek lekérdezésekor: ", error));
  }, []);

  // Toggle product data display
  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_product/${id}`);
      if (response.status === 200) {
        console.log('Sikeres törlés');
        // Remove deleted product from the list
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
      } else {
        console.log('Sikertelen törlés');
      }
    } catch (error) {
      console.log("Hiba történt a törlés közben: ", error);
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="pt-4">
        <div className="container shadow d-flex flex-column pt-4">
          <h2>Termékek</h2>
          <div className="d-flex">
            <button type="button" className="btn btn-primary mb-3 mt-2 me-2" onClick={handleProductsButtonClick}>
              Lekérdezés
            </button>
            <Link to="/addproduct" type="button" className="btn btn-primary w-25 mb-3 mt-2" width="10%">
              Termék hozzáadása
            </Link>
          </div>
          {productData &&
            <div className="container pt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col" width="5%"><input className="form-check-input" type="checkbox" /></th>
                    <th>Id</th>
                    <th scope="productName">Terméknév</th>
                    <th scope="productType">Típus</th>
                    <th scope="productSize">Méret</th>
                    <th scope="operations">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="6">Nincs termék adat</td></tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <th scope="col" width="5%"><input className="form-check-input" type="checkbox" /></th>
                        <th scope="row">{product.id}</th>
                        <td>{product.product_name}</td>
                        <td>{product.product_type}</td>
                        <td>{product.product_size}</td>
                        <td>
                          <button type="button" className="btn btn-danger me-2 btn-sm d-block d-md-inline mt-2 mt-md-0" onClick={() => handleDeleteButtonClick(product.id)}>
                            Törlés
                          </button>
                          <Link to={`/editproduct/${product.id}`} type="button" className="btn btn-success btn-sm me-2 d-block d-md-inline mt-2 mt-md-0">
                            Edit
                          </Link>
                          {product.hasPhotos && (
                            <Link to={`/productphotos/${product.id}`} type="button" className="btn btn-info btn-sm d-block d-md-inline mt-2 mt-md-0">
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
