import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Termekek.css'
import { Navbar } from '../../components';

export default function Termekek() {

  const [productData, setProductData] = useState(false);
  const [products, setProducts] = useState([{}]);

  // termék lekérdezés
  useEffect(() => {
    axios.get("/api/termekek")
      .then(response => setProducts(response.data))
      .catch(error => console.log("Hiba a termékek lekérdezésekor: ", error));
  }, []);

  // termék lekérdezés gomb
  const handleProductsButtonClick = () => {
    setProductData(!productData);
  };

  // termék törlés gomb
  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_termek/${id}`);
      if (response.status === 200) {
        console.log('Sikeres törlés');
        //sikeres törlés után felh listát frissíteni kell
        const updatedProducts = products.filter(product => product.id !== id); // a törlendő elemet kivesszük a listából
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
      <Navbar />
      <div className="pt-4">
        <div className="container shadow d-flex flex-column pt-4">
          <h2>Termékek</h2>
          <div className="d-flex">
            <button type="button" className="btn btn-primary mb-3 mt-2 me-2" onClick={handleProductsButtonClick}>
              Lekérdezés
            </button>
            <Link to="/addproduct" type="button" className="btn btn-primary w-25 mb-3 mt-2">
              Termék hozzáadása
            </Link>
          </div>
          {productData &&
            <div className="container pt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th scope="termeknev">Terméknév</th>
                    <th scope="tipus">Típus</th>
                    <th scope="meret">Méret</th>
                    <th scope="muveletek">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="5">Nincs termék adat</td></tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <th scope="row">{product.id}</th>
                        <td>{product.termeknev}</td>
                        <td>{product.tipus}</td>
                        <td>{product.meretek}</td>
                        <td>
                          <Link to={`/termekfotok/${product.id}`} type="button" className="btn btn-info me-2 btn-sm d-block d-md-inline mt-2 mt-md-0">
                            Fotók
                          </Link>
                          <Link to={`/editproduct/${product.id}`} type="button" className="btn btn-success btn-sm me-2 d-block d-md-inline mt-2 mt-md-0">
                            Edit
                          </Link>
                          <button type="button" className="btn btn-danger btn-sm d-block d-md-inline mt-2 mt-md-0" onClick={() => handleDeleteButtonClick(product.id)} >
                            Törlés
                          </button>
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