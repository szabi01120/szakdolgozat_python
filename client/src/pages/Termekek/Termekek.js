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
            <Link to="/addproduct" type="button" className="btn btn-primary w-25 mb-3 mt-2" width="10%">
              Termék hozzáadása
            </Link>
          </div>
          {productData &&
            <div className="container pt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col" width="5%"><input class="form-check-input" type="checkbox" /></th>
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
                        <th scope="col" width="5%"><input class="form-check-input" type="checkbox" /></th>
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

          {/*<div class="container mt-5 px-2">

            <div class="mb-2 d-flex justify-content-between align-items-center">

              <div class="position-relative">
                <span class="position-absolute search"><i class="fa fa-search"></i></span>
                <input class="form-control w-100" placeholder="Search by order#, name..." />
              </div>

              <div class="px-2">

                <span>Filters <i class="fa fa-angle-down"></i></span>
                <i class="fa fa-ellipsis-h ms-3"></i>
              </div>

            </div>
             <div class="table-responsive">
              <table class="table table-responsive table-borderless">

                <thead>
                  <tr class="bg-light">
                    <th scope="col" width="5%"><input class="form-check-input" type="checkbox" /></th>
                    <th scope="col" width="5%">#</th>
                    <th scope="col" width="20%">Date</th>
                    <th scope="col" width="10%">Status</th>
                    <th scope="col" width="20%">Customer</th>
                    <th scope="col" width="20%">Purchased</th>
                    <th scope="col" class="text-end" width="20%"><span>Revenue</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><input class="form-check-input" type="checkbox" /></th>
                    <td>12</td>
                    <td>1 Oct, 21</td>
                    <td><i class="fa fa-check-circle-o green"></i><span class="ms-1">Paid</span></td>
                    <td><img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Althan Travis</td>
                    <td>Wirecard for figma</td>
                    <td class="text-end"><span class="fw-bolder">$0.99</span> <i class="fa fa-ellipsis-h  ms-2"></i></td>
                  </tr>

                  <tr>
                    <th scope="row"><input class="form-check-input" type="checkbox" /></th>
                    <td>14</td>
                    <td>12 Oct, 21</td>
                    <td><i class="fa fa-dot-circle-o text-danger"></i><span class="ms-1">Failed</span></td>
                    <td><img src="https://i.imgur.com/nmnmfGv.png" width="25" /> Tomo arvis</td>
                    <td>Altroz furry</td>
                    <td class="text-end"><span class="fw-bolder">$0.19</span> <i class="fa fa-ellipsis-h  ms-2"></i></td>
                  </tr>


                  <tr>
                    <th scope="row"><input class="form-check-input" type="checkbox" /></th>
                    <td>17</td>
                    <td>1 Nov, 21</td>
                    <td><i class="fa fa-check-circle-o green"></i><span class="ms-1">Paid</span></td>
                    <td><img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Althan Travis</td>
                    <td>Apple Macbook air</td>
                    <td class="text-end"><span class="fw-bolder">$1.99</span> <i class="fa fa-ellipsis-h  ms-2"></i></td>
                  </tr>


                  <tr>
                    <th scope="row"><input class="form-check-input" type="checkbox" /></th>
                    <td>90</td>
                    <td>19 Oct, 21</td>
                    <td><i class="fa fa-check-circle-o green"></i><span class="ms-1">Paid</span></td>
                    <td><img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Travis head</td>
                    <td>Apple Macbook Pro</td>
                    <td class="text-end"><span class="fw-bolder">$9.99</span> <i class="fa fa-ellipsis-h  ms-2"></i></td>
                  </tr>


                  <tr>
                    <th scope="row"><input class="form-check-input" type="checkbox" /></th>
                    <td>12</td>
                    <td>1 Oct, 21</td>
                    <td><i class="fa fa-check-circle-o green"></i><span class="ms-1">Paid</span></td>
                    <td><img src="https://i.imgur.com/nmnmfGv.png" width="25" /> Althan Travis</td>
                    <td>Wirecard for figma</td>
                    <td class="text-end"><span class="fw-bolder">$0.99</span> <i class="fa fa-ellipsis-h  ms-2"></i></td>
                  </tr>
                </tbody>
              </table>

            </div> 

          </div>*/}
        </div>
      </div>
    </div>
  );
}