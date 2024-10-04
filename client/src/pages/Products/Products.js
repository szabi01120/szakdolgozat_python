import React, { useState, useEffect } from 'react';
import EditProductModal from './EditProductModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import DeleteModal from '../../components/DeleteProductModal/DeleteModal';

export default function Products() {
  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsToMove, setProductsToMove] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

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

  const handleDeleteButtonClick = (id) => {
    setProductIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_product/${productIdToDelete}`);
      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== productIdToDelete));
        console.log('Sikeres törlés');
      } else {
        console.log('Sikertelen törlés');
        setShowDeleteModal(false);
      }
    } catch (error) {
      setShowDeleteModal(false);
      console.log('Hiba történt a törlés közben: ', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Modal bezárása
    setProductIdToDelete(null); // Törölt termék azonosítójának törlése
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
    setShowModal(true); // Show the modal
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
        setShowModal(false); // Close the modal
        console.log("Termék sikeresen frissítve!");
      }
    } catch (error) {
      console.error("Hiba a termék frissítése közben: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
    setShowModal(false); // Close the modal
  };

  const handleSaveButtonClick = async () => {
    if (productsToMove.length > 0) {
      try {
        // Termékek, amiket move-olni kell
        const productsToMoveDetails = products
          .filter((product) => productsToMove.includes(product.id))
          .map((product) => ({
            id: product.id,
            quantity: product.quantity, // Az aktuális darabszám, amit ellenőrizni kell
          }));

        const response = await axios.post('/api/update_product_status', productsToMoveDetails);

        if (response.status === 200) {
          // Sikeres válasz esetén frissítjük a termékeket
          const updatedProducts = products.map((product) => {
            if (productsToMove.includes(product.id)) {
              const updatedQuantity = product.quantity - 1; // Csökkentjük a darabszámot

              // Ha a darabszám 0, akkor eltávolítjuk a listából
              if (updatedQuantity <= 0) {
                return null; // Eltávolítjuk a nullákat
              }

              return {
                ...product,
                quantity: updatedQuantity,
                sold: false,  // A backend false-ra állította, így itt is frissítjük
                shipped: false,  // Szintén false-ra állítjuk
              };
            }

            return product; // A többi termék változatlan marad
          }).filter(Boolean); // Null elemek eltávolítása

          // Frissítjük az állapotot
          setProducts(updatedProducts);
          setProductsToMove([]); // Kiürítjük a mozgatandó termékek listáját
          setShowSuccessModal(true); // alert mutatása

          console.log('Sikeres módosítás, termékek áthelyezve és frissítve.');
        } else {
          console.log('Sikertelen módosítás');
          setShowFailedModal(true); // alert mutatása
        }
      } catch (error) {
        console.log('Hiba történt a módosítás közben: ', error);
        setShowFailedModal(true); // alert mutatása
      }
    } else {
      console.log('Nincs termék a feltételekhez');
    }
  };

  // Véletlenszerű termék hozzáadása TESTING PURPOSES ONLY
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
      {/* Sikeres forgalomba mentés modal */}
      <NotificationModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        message="A termék sikeresen frissítve!"
        variant="success"
      />

      {/* Sikertelen forgalomba mentés modal */}
      <NotificationModal
        show={showFailedModal}
        onHide={() => setShowFailedModal(false)}
        message="Hiba történt a termék frissítése közben!"
        variant="danger"
      />

      {/* Szerkesztés modal */}
      <EditProductModal
        show={showModal}
        onHide={handleCancelEdit}
        editedProduct={editedProduct}
        onInputChange={handleInputChange}
        onSaveEdit={handleSaveEdit}
      />

      {/* Törlés modal */}
      <DeleteModal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        message="Biztosan törölni szeretnéd ezt a terméket?"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />

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
            {/* <button type="button" className="btn btn-secondary mb-3" onClick={handleAddRandomProduct}>
              Véletlenszerű termék hozzáadása
            </button> */}
          </div>
          {productData && (
            <div className='product-table-container'>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Termék neve</th>
                    <th>Típus</th>
                    <th>Méret</th>
                    <th>Mennyiség</th>
                    <th>Gyártó</th>
                    <th>Ár</th>
                    <th>Eladva?</th>
                    <th>Szállítva?</th>
                    <th>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td data-label="Id">{product.id}</td>
                      <td data-label="Termék neve">{product.product_name}</td>
                      <td data-label="Típus">{product.product_type}</td>
                      <td data-label="Méret">{product.product_size}</td>
                      <td data-label="Mennyiség">{product.quantity}</td>
                      <td data-label="Gyártó">{product.manufacturer}</td>
                      <td data-label="Ár">
                        {priceFormatter.format(product.price)} {product.currency}
                      </td>
                      <td data-label="Eladva?">
                        <input
                          type="checkbox"
                          id={`checkbox-sold-${index}`}
                          checked={product.sold}
                          onChange={() => handleCheckboxChange(index, 'sold')}
                        />
                        <label htmlFor={`checkbox-sold-${index}`}></label>
                      </td>
                      <td data-label="Szállítva?">
                        <input
                          type="checkbox"
                          id={`checkbox-shipped-${index}`}
                          checked={product.shipped}
                          onChange={() => handleCheckboxChange(index, 'shipped')}
                        />
                        <label htmlFor={`checkbox-shipped-${index}`}></label>
                      </td>
                      <td data-label="Műveletek">
                        <div className={`btn-group ${!product.hasPhotos ? 'no-photo' : ''} me-2`}>
                          {product.hasPhotos ? (
                            <Link to={`/productphotos/${product.id}`} className="btn btn-photo me-2">
                              Fotók
                            </Link>
                          ) : (
                            <div className="empty-photo-placeholder me-4"></div>
                          )}
                          <button className="btn btn-edit" onClick={() => handleEditClick(product)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteButtonClick(product.id)}>
                            Törlés
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
