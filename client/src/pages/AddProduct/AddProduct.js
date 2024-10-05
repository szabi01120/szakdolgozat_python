import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';
import AddModal from './AddModal';
import { NotificationModal } from '../../components';

export default function AddProduct() {
  const [images, setImages] = useState([]); // képek tömb
  const [isDragging, setIsDragging] = useState(false); // drag and drop állapota
  const [redirectToProducts, setRedirectToProducts] = useState(false); // termékek oldalra irányítás
  const [productTypes, setProductTypes] = useState([]); // Termék típusok
  const [manufacturers, setManufacturers] = useState([]); // Termék gyártók

  const fileInputRef = useRef(); // input referencia

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Hiba történt a hozzáadás során!');

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddNotificationModalSuccess, setShowAddNotificationModalSuccess] = useState(false);
  const [showAddNotificationModalError, setShowAddNotificationModalError] = useState(false);

  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddManufacturerModal, setShowAddManufacturerModal] = useState(false);
  const [newType, setNewType] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');


  const [formData, setFormData] = useState({
    incoming_invoice: '',
    product_name: '',
    product_type: '',
    product_size: '',
    quantity: '',
    manufacturer: '',
    price: '',
    currency: ''
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    const getProductTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product_types');
        setProductTypes(response.data);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    const getManufacturers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product_manufacturers');
        setManufacturers(response.data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };

    getProductTypes();
    getManufacturers();
  }, []);

  useEffect(() => { }, [productTypes]);

  useEffect(() => { }, [manufacturers]);

  useEffect(() => {
    if (showImageUpload) {
      setIsFormFilled(
        Object.values(formData).every(value => value !== '') && images.length > 0
      );
    } else {
      setIsFormFilled(Object.values(formData).every(value => value !== ''));
    }
  }, [formData, images, showImageUpload]);

  function selectFiles() {
    if (!showImageUpload) return;
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    if (!showImageUpload) return;
    const files = event.target.files;
    if (files.length === 0) return;
    const newImages = Array.from(files).filter(file => file.type.split('/')[0] === 'image' && !images.some((e) => e.name === file.name));
    setImages((prevImages) => [
      ...prevImages,
      ...newImages,
    ]);
  }

  function deleteImage(index) {
    if (!showImageUpload) return;
    setImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  }

  function onDragOver(event) {
    if (!showImageUpload) return;
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = 'copy';
  }

  function onDragLeave(event) {
    if (!showImageUpload) return;
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    if (!showImageUpload) return;
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    const newImages = Array.from(files).filter(file => file.type.split('/')[0] === 'image' && !images.some((e) => e.name === file.name));
    setImages((prevImages) => [
      ...prevImages,
      ...newImages,
    ]);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'price') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = new Intl.NumberFormat('hu-HU').format(numericValue);

      setFormData({ ...formData, [name]: numericValue });
      event.target.value = formattedValue;
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTypeClick = () => {
    setShowAddTypeModal(true);
  };

  const handleManufacturerClick = () => {
    setShowAddManufacturerModal(true);
  };

  const handleTypeInputChange = (event) => {
    setNewType(event.target.value);
  };

  const handleManufacturerInputChange = (event) => {
    setNewManufacturer(event.target.value);
  };

  const handleSaveType = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/add_product_type', { "product_type": newType });
      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
        console.log('Válasz:', response.data);

        const newProductType = { id: response.data.id, product_type: response.data.product_type };
        setProductTypes((prevTypes) => {
          const updatedTypes = [...prevTypes, newProductType];
          return updatedTypes;
        });

        setFormData((prevFormData) => ({ ...prevFormData, product_type: newProductType.id }));

        setShowAddTypeModal(false);
        setShowAddNotificationModalSuccess(true);
      }
    } catch (error) {
      console.log('Hiba történt a típus hozzáadása során:', error.response);
      setShowAddTypeModal(false);
      setShowAddNotificationModalError(true);
    }
  };

  const handleSaveManufacturer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/add_product_manufacturer', { "manufacturer": newManufacturer });
      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
        console.log('Válasz:', response.data);
        setShowAddManufacturerModal(false);
        setShowAddNotificationModalSuccess(true);
        setManufacturers((prevManufacturers) => [...prevManufacturers, response.data]);
      }
    } catch (error) {
      console.log('Hiba történt a gyártó hozzáadása során:', error.response);
      setShowAddManufacturerModal(false);
      setShowAddNotificationModalError(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (showImageUpload && images.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];

      const invalidFiles = images.filter((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(extension);
      });

      images.forEach((file) => {
        console.log(`File name: ${file.name}, File type: ${file.type}`);
      });

      if (invalidFiles.length > 0) {
        console.log('Nem megfelelő fájlformátum');
        console.log('Hibás fájlformátum:', invalidFiles);
        setErrorMessage('Hibás fájlformátum! Csak .jpg .jpeg .png engedélyezett.');
        setIsError(true);
        return;
      }
    }

    // ha érvényesek a fájlformátumok, akkor hozzáadjuk a terméket
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/add_product', formData);
      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
        const product_id = response.data.product_id;
        console.log('Válasz:', response.data);
        console.log('Termék ID:', product_id);

        // ha van kép feltöltjük a termék után
        // itt már tudjuk hogy jók a formátumok, feljebb lekezeltük
        if (showImageUpload) {
          const data = new FormData();
          for (let i = 0; i < images.length; i++) {
            data.append("files[]", images[i]);
          }
          try {
            await axios.post(`http://127.0.0.1:5000/api/img_upload/${product_id}`, data);
          } catch (error) {
            if (error.response.status === 415) {
              console.log('Nem megfelelő fájlformátum');
              setIsError(true);
              return;
            }
            console.log('Hiba történt:', error);
            setErrorMessage('Hibás fájlformátum! Csak .jpg .jpeg .png engedélyezett.');
            setIsError(true);
            return;
          }
        }
        setShowNotificationModal(true);
      }
    } catch (error) {
      console.log('Hiba történt:', error.response);
      console.log('data:', formData);
      setIsError(true);
    }
  };

  const inputFields = [
    { label: 'Terméknév', name: 'product_name', placeholder: 'Terméknév', type: 'text' },
    { label: 'Méret', name: 'product_size', placeholder: 'Méret', type: 'text' },
    { label: 'Mennyiség', name: 'quantity', placeholder: 'Mennyiség', type: 'number', min: '0' },
    { label: 'Nettó ár', name: 'price', placeholder: 'Nettó ár', type: 'text' }, // Fontos: itt text, hogy formázhassuk
    { label: 'Bejövő számla', name: 'incoming_invoice', placeholder: 'Bejövő számla', type: 'text' },
  ];

  const currencyTypes = ['HUF', 'EUR', 'USD']; // Pénznem listája

  const renderForm = (
    <div className='pt-4'>
      <div className="container shadow d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center position-relative">
          <h2 className="position-absolute start-50 translate-middle-x ">Termék hozzáadása</h2>
          <div></div>
          <div className="d-flex mt-3">
            <button type="button" className="btn btn-edit" onClick={handleTypeClick}>Típus felvétel</button>
            <button type="button" className="btn btn-edit" onClick={handleManufacturerClick}>Gyártó felvétel</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='row g-3'>
          {inputFields.map((field, index) => (
            <div className='col-md-3' key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                className="form-control"
                id={field.name}
                name={field.name}
                onChange={handleChange}
                placeholder={field.placeholder}
                value={field.name === 'price' ? new Intl.NumberFormat('hu-HU').format(formData[field.name]) : formData[field.name]} // nettó ár formázás
                min={field.min}
                step={field.step} />
            </div>
          ))}
          <div className='col-md-3'>
            <label htmlFor="currenc">Gyártó</label>
            <select className="form-select" id="manufacturer" name="manufacturer" onChange={handleChange} value={formData.manufacturer}>
              <option value="">Válassz gyártót</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.manufacturer}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3'>
            <label htmlFor="currenc">Pénznem</label>
            <select className="form-select" id="currency" name="currency" onChange={handleChange} value={formData.currency}>
              <option value="">Válassz pénznemet</option>
              {currencyTypes.map((currency, index) => (
                <option key={index} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3'>
            <label htmlFor="product_type">Típus</label>
            <select className="form-select" id="product_type" name="product_type" onChange={handleChange} value={formData.product_type}>
              <option value="">Válassz egy típust</option>
              {productTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.product_type}</option>
              ))}
            </select>
          </div>
          <div className='col-md-12'>
            <button type="submit" className="btn btn-primary mb-3 mt-2" disabled={!isFormFilled}>Hozzáadás</button>
            {isError && <p className='text-danger'>{errorMessage}</p>}
          </div>

          <h2>Képfeltöltés</h2>
          <div className='col-md-12'>
            <div className='form-check'>
              <input className='form-check-input' type='checkbox' id='showImageUpload' checked={showImageUpload} onChange={() => setShowImageUpload(!showImageUpload)} />
              <label className='form-check-label' htmlFor='showImageUpload'>
                Képfeltöltés engedélyezése
              </label>
            </div>
          </div>
          {showImageUpload && (
            <div className='card'>
              <div className='top'>
                <p>Képfeltöltés | Drag & Drop</p>
              </div>
              <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                  <span className='select'>
                    Húzd ide a képeket
                  </span>
                ) : (
                  <>
                    Húzd ide a képeket vagy {" "}
                    <span className='select' role='button' onClick={selectFiles}>
                      VÁLASZD KI
                    </span>
                  </>
                )}
                <input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect}></input>
              </div>
              <div className='container'>
                {images.map((image, index) => (
                  <div className="image" key={index}>
                    <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                    <img src={URL.createObjectURL(image)} alt={image.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  // átirányítás
  if (redirectToProducts) {
    return <Navigate to="/raktar" />;
  }

  return (
    <div>
      <AddModal
        show={showAddTypeModal}
        onHide={() => setShowAddTypeModal(false)}
        onInputChange={handleTypeInputChange}
        onSaveEdit={handleSaveType}
        name='Típus'
        inputValue={newType}
      />
      <AddModal
        show={showAddManufacturerModal}
        onHide={() => setShowAddManufacturerModal(false)}
        onInputChange={handleManufacturerInputChange}
        onSaveEdit={handleSaveManufacturer}
        name='Gyártó'
        inputValue={newManufacturer}
      />
      <NotificationModal
        show={showAddNotificationModalSuccess}
        onHide={() => setShowAddNotificationModalSuccess(false)}
        message='Sikeres hozzáadás!'
        variant='success'
      />
      <NotificationModal
        show={showAddNotificationModalError}
        onHide={() => setShowAddNotificationModalError(false)}
        message='Hiba történt a hozzáadás során!'
        variant='danger'
      />
      <NotificationModal
        show={showNotificationModal}
        onHide={() => {
          setShowNotificationModal(false);
          setRedirectToProducts(true);
        }}
        message='Sikeres hozzáadás! Az oldal frissítésre kerül.'
        variant='success'
      />
      {renderForm}
    </div>
  );
}
