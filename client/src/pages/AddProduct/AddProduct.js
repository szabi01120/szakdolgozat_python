import { Navbar } from '../../components';
import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';

export default function AddProduct({ user }) {
  const [images, setImages] = useState([]); // képek tömb
  const [isDragging, setIsDragging] = useState(false); // drag and drop állapota
  const [redirectToProducts, setRedirectToProducts] = useState(false); // termékek oldalra irányítás

  const fileInputRef = useRef(); // input referencia

  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    product_size: '',
    quantity: '',
    manufacturer: '',
    price: '',
    currency: ''
  });
  const [responseMsg, setResponseMsg] = useState({
    status: "",
    message: "",
    error: "",
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

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
      // Eltávolítunk minden nem numerikus karaktert, hogy csak számok maradjanak
      const numericValue = value.replace(/\D/g, '');

      // A számot formázzuk tizedes elválasztókkal
      const formattedValue = new Intl.NumberFormat('hu-HU').format(numericValue);

      // Frissítjük az input mezőt formázott értékkel
      setFormData({ ...formData, [name]: numericValue });

      // Az input mezőt frissítjük formázott értékkel
      event.target.value = formattedValue;
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/add_product', formData);
      console.log('Válasz:', response.data);

      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
        const product_id = response.data.product_id;
        console.log('Termék ID:', product_id);

        if (showImageUpload) {
          const data = new FormData();
          for (let i = 0; i < images.length; i++) {
            data.append("files[]", images[i]);
          }

          try {
            await axios.post(`http://127.0.0.1:5000/api/img_upload/${product_id}`, data);
          } catch (error) {
            console.log('Hiba történt:', error);
            setIsError(true);
            return;
          }
        }

        // Sikeres hozzáadás esetén állítsd be az átirányítást
        alert('Sikeres hozzáadás! Az oldal frissítésre kerül.');
        setRedirectToProducts(true);
      }
    } catch (error) {
      console.log('Hiba történt:', error.response);
      setIsError(true);
    }
  };

  const inputFields = [
    { label: 'Terméknév', name: 'product_name', placeholder: 'Terméknév', type: 'text' },
    { label: 'Méret', name: 'product_size', placeholder: 'Méret', type: 'text' },
    { label: 'Mennyiség', name: 'quantity', placeholder: 'Mennyiség', type: 'number', min: '0' },
    { label: 'Gyártó', name: 'manufacturer', placeholder: 'Gyártó', type: 'text' },
    { label: 'Nettó ár', name: 'price', placeholder: 'Nettó ár', type: 'text' }, // Fontos: itt text, hogy formázhassuk
  ];

  const types = ['Típus 1', 'Típus 2', 'Típus 3']; // Típusok listája
  const currencyTypes = ['HUF', 'EUR', 'USD']; // Pénznem listája

  const renderForm = (
    <div className='pt-4'>
      <div className="container shadow d-flex flex-column p-4">
        <h2>Termék hozzáadása</h2>
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
              <option value="">Válassz típust</option>
              {types.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className='col-md-12'>
            <button type="submit" className="btn btn-primary w-25 mb-3 mt-2" disabled={!isFormFilled}>Hozzáadás</button>
            {isError && <p className='text-danger'>Hiba történt a hozzáadás során!</p>}
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

  // felhasználó átirányítása
  if (redirectToProducts) {
    return <Navigate to="/raktar" />;
  }

  return (
    <div>
      <Navbar user={user} />
      {renderForm}
    </div>
  );
}
