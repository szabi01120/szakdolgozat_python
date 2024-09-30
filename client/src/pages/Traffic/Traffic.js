import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditSoldProductModal from './EditSoldProductModal';
import DeleteModal from '../../components/DeleteProductModal/DeleteModal';
import './Traffic.css';


export default function Traffic() {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [showModal, setShowModal] = useState(false); // Modális állapot

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteButtonClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      console.log('Nincs kijelölt termék.');
      return;
    }
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          axios.delete(`http://127.0.0.1:5000/api/delete_sold_product/${id}`)
        )
      );
      setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      console.log('Sikeres törlés.');
    } catch (error) {
      console.log('Hiba történt a törlés közben: ', error);
      setShowDeleteModal(false);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditedProduct(product);
    setShowModal(true); // modál megnyitása
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
      {/* Törlés modal */}
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        message="Biztosan törölni szeretnéd ezt a terméket?"
        variant="danger"
        onConfirm={handleConfirmDeleteSelectedProducts}
      />
      {/* Szerkesztés modál ablak */}
      <EditSoldProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editedProduct={editedProduct}
        onInputChange={handleInputChange}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
      />
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
              onClick={handleDeleteButtonClick}
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
                    <th>Vásárló neve</th>
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
                        <td>{product.customer_name}</td>
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
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEditClick(product)}
                          >
                            Edit
                          </button>
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
