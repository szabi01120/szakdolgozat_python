import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Traffic.css';
import { Navbar } from '../../components';
import { Modal, Button } from 'react-bootstrap';


export default function Traffic({ user }) {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [showModal, setShowModal] = useState(false); // Modális állapot

  const priceFormatter = new Intl.NumberFormat('hu-HU');

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

  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  const handleCheckboxChange = (index) => {
    const updatedProducts = [...selectedProducts];
    if (updatedProducts.includes(index)) {
      updatedProducts.splice(updatedProducts.indexOf(index), 1);
    } else {
      updatedProducts.push(index);
    }
    setSelectedProducts(updatedProducts);
  };

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
        setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
        setSelectedProducts([]);
      } catch (error) {
        console.log('Hiba történt a törlés közben: ', error);
      }
    } else {
      console.log('A törlés megszakítva.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditedProduct(product);
    setShowModal(true); // Modális megnyitása
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
      const response = await axios.put(`/api/update_sold_product/${editingProductId}`, editedProduct, { withCredentials: true });
      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.id === editingProductId ? editedProduct : product
        );
        setProducts(updatedProducts);
        setEditingProductId(null);
        setEditedProduct({});
        setShowModal(false); // Modális bezárása
        console.log("Termék sikeresen frissítve!");
      }
    } catch (error) {
      console.error("Hiba a termék frissítése közben: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
    setShowModal(false); // Modális bezárása
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
            <div>
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
                    <th>Pénznem</th>
                    <th>Eladás dátuma</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="13">Nincs termék adat</td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.product_name}</td>
                        <td>{product.incoming_invoice}</td>
                        <td>{product.outgoing_invoice}</td>
                        <td>{product.product_type}</td>
                        <td>{product.product_size}</td>
                        <td>{product.quantity} db</td>
                        <td>{product.manufacturer}</td>
                        <td>{priceFormatter.format(product.price)}</td>
                        <td>{product.currency}</td>
                        <td>{product.date}</td>
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
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditClick(product)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Modális ablak */}
          <Modal show={showModal} onHide={handleCancelEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Termék szerkesztése</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <label>Terméknév</label>
                <input
                  type="text"
                  name="product_name"
                  value={editedProduct.product_name || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Bejövő számla</label>
                <input
                  type="text"
                  name="incoming_invoice"
                  value={editedProduct.incoming_invoice || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Kimenő számla</label>
                <input
                  type="text"
                  name="outgoing_invoice"
                  value={editedProduct.outgoing_invoice || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Típus</label>
                <input
                  type="text"
                  name="product_type"
                  value={editedProduct.product_type || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Méret</label>
                <input
                  type="text"
                  name="product_size"
                  value={editedProduct.product_size || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Mennyiség</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity || 0}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Gyártó</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={editedProduct.manufacturer || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Nettó ár</label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price || 0}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label>Pénznem</label>
                <input
                  type="text"
                  name="currency"
                  value={editedProduct.currency || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Mégse
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Mentés
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
