import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';
import { Navbar } from '../../components';

export default function Products({ user }) {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsToMove, setProductsToMove] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const priceFormatter = new Intl.NumberFormat('hu-HU');

  useEffect(() => {
    axios
      .get('/api/products')
      .then(async (response) => {
        const productsWithPhotos = await Promise.all(
          response.data.map(async (product) => {
            try {
              // Fotók lekérése a szerverről
              const photoResponse = await axios.get(`http://127.0.0.1:5000/api/images/${product.id}`);
              product.hasPhotos = photoResponse.data.length > 0;
            } catch (error) {
              console.log('Hiba a képek lekérdezésekor: ', error);
              product.hasPhotos = false;
            }
  
            product.sold = product.sold || false;
            product.shipped = product.shipped || false;
            
            if (product.sold && product.shipped) { // lekérdezésnél is kell tudni hogy van e termék amit move-olni kell
              setProductsToMove((prevProductsToMove) => [...prevProductsToMove, product.id]);
            }
            return product;
          })
        );
        setProducts(productsWithPhotos);  
      })
      .catch((error) => console.log('Hiba a termékek lekérdezésekor: ', error));
  }, []);  

  const generateRandomProduct = () => { // FOR TESTING PURPOSES ONLY!!
    const randomId = Math.floor(Math.random() * 10000);  // Véletlenszerű ID
    return {
      incoming_invoice: `Számla ${randomId}`,
      product_name: `Termék ${randomId}`,
      product_type: ['Típus1', 'Típus2', 'Típus3'][Math.floor(Math.random() * 3)], // Random típus
      product_size: ['Kicsi', 'Közepes', 'Nagy'][Math.floor(Math.random() * 3)], // Random méret
      quantity: Math.floor(Math.random() * 100) + 1, // Random mennyiség
      manufacturer: ['Gyártó1', 'Gyártó2', 'Gyártó3'][Math.floor(Math.random() * 3)], // Random gyártó
      price: Math.floor(Math.random() * 100000), // Random ár
      currency: ['HUF', 'EUR', 'USD'][Math.floor(Math.random() * 3)], // Random pénznem
    };
  };

  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  const handleDeleteButtonClick = async (id) => {
    const confirmed = window.confirm("Biztosan törölni szeretnéd ezt a terméket?");
    if (confirmed) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/api/delete_product/${id}`);
        if (response.status === 200) {
          console.log('Sikeres törlés');
          setProducts(products.filter((product) => product.id !== id));
          const storedStates = JSON.parse(localStorage.getItem('productsStates')) || {};
          delete storedStates[id];
          localStorage.setItem('productsStates', JSON.stringify(storedStates));
        } else {
          console.log('Sikertelen törlés');
        }
      } catch (error) {
        console.log('Hiba történt a törlés közben: ', error);
      }
    } else {
      console.log('Törlés megszakítva');
    }
  };

  const handleCheckboxChange = async (index, field) => {
    const updatedProductsCopy = [...products];
    const product = updatedProductsCopy[index];
    product[field] = !product[field]; // Váltás a checkbox értéken (true/false)
  
    try {
      const response = await axios.put(`/api/update_checkbox_state/${product.id}`, {
        [field]: product[field],
      });
  
      if (response.status === 200) {
        console.log(`Termék ${field} mezőjének frissítése sikeres`);
        
        // ha mindkettő true, akkor hozzáadjuk a terméket a productsToMove tömbhöz
        if (product.sold && product.shipped) {
          if (!productsToMove.includes(product.id)) {
            setProductsToMove((prevProductsToMove) => [...prevProductsToMove, product.id]);
          }
        } else {
          // ha valamelyik false, akkor kiszedjük mert nem kell oda
          setProductsToMove((prevProductsToMove) =>
            prevProductsToMove.filter((id) => id !== product.id)
          );
        }
      } else {
        console.log(`Sikertelen frissítés: ${field}`);
      }
    } catch (error) {
      console.error(`Hiba a ${field} mező frissítése közben: `, error);
    }
  
    // Frissítjük a komponens állapotát a helyi változásokkal
    setProducts(updatedProductsCopy);
  };
  

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditedProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/api/update_product/${editingProductId}`, editedProduct, { withCredentials: true });
      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.id === editingProductId ? editedProduct : product
        );
        setProducts(updatedProducts);
        setEditingProductId(null);
        setEditedProduct({});
        console.log("Termék sikeresen frissítve!");
      }
    } catch (error) {
      console.error("Hiba a termék frissítése közben: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
  };

  const handleSaveButtonClick = async () => {
    if (productsToMove.length > 0) {
      try {
        const response = await axios.post('/api/update_product_status', productsToMove);
        if (response.status === 200) {
          setProducts(products.filter((product) => !productsToMove.includes(product.id)));
          setProductsToMove([]);
          
          console.log('Sikeres módosítás');
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

  // Véletlenszerű termék hozzáadása
  const handleAddRandomProduct = async () => {
    const randomProduct = generateRandomProduct();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/add_product', randomProduct);
      if (response.status === 200) {
        setProducts([...products, randomProduct]);
        console.log("Random termék sikeresen hozzáadva!");
      }
    } catch (error) {
      console.log("Hiba a random termék hozzáadása közben: ", error);
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
            {/* Random termék gomb */}
            <button type="button" className="btn btn-secondary mb-3" onClick={handleAddRandomProduct}>
              Véletlenszerű termék hozzáadása
            </button>
          </div>
          {productData && (
            <div>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Terméknév</th>
                    <th>Bejövő számla</th>
                    <th>Típus</th>
                    <th>Méret</th>
                    <th>Mennyiség</th>
                    <th>Gyártó</th>
                    <th>Nettó ár</th>
                    {!editingProductId && (
                      <>
                        <th>Eladva?</th>
                        <th>Szállítva?</th>
                      </>
                    )}
                    <th>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="10">Nincs termék adat</td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        {editingProductId === product.id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                name="product_name"
                                value={editedProduct.product_name || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="incoming_invoice"
                                value={editedProduct.incoming_invoice || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="product_type"
                                value={editedProduct.product_type || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="product_size"
                                value={editedProduct.product_size || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="quantity"
                                value={editedProduct.quantity || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="manufacturer"
                                value={editedProduct.manufacturer || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="price"
                                value={editedProduct.price || ''}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <div className="btn-group">
                                <button className="btn btn-edit me-2" onClick={handleSaveEdit}>
                                  Mentés
                                </button>
                                <button className="btn btn-danger" onClick={handleCancelEdit}>
                                  Mégse
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{product.product_name}</td>
                            <td>{product.incoming_invoice}</td>
                            <td>{product.product_type}</td>
                            <td>{product.product_size}</td>
                            <td>{product.quantity}</td>
                            <td>{product.manufacturer}</td>
                            <td>{priceFormatter.format(product.price)}</td>
                            {!editingProductId && (
                              <>
                                <td>
                                  <input
                                    type="checkbox"
                                    id={`checkbox-sold-${index}`}
                                    checked={product.sold}
                                    onChange={() => handleCheckboxChange(index, 'sold')}
                                  />
                                  <label htmlFor={`checkbox-sold-${index}`}></label>
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    id={`checkbox-shipped-${index}`}
                                    checked={product.shipped}
                                    onChange={() => handleCheckboxChange(index, 'shipped')}
                                  />
                                  <label htmlFor={`checkbox-shipped-${index}`}></label>
                                </td>

                              </>
                            )}
                            <td>
                              <div className="btn-group">
                                <button className="btn btn-edit me-2" onClick={() => handleEditClick(product)}>
                                  Edit
                                </button>
                                {product.hasPhotos &&
                                  <Link to={`/productphotos/${product.id}`} className="btn btn-photo me-2">
                                    Fotók
                                  </Link>
                                }
                                <button className="btn btn-danger" onClick={() => handleDeleteButtonClick(product.id)}>
                                  Törlés
                                </button>
                              </div>
                            </td>
                          </>
                        )}
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
