import { Navbar } from '..';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

export default function AddProduct() {
  const [images, setImages] = useState([]); // képek tömb
  const [isDragging, setIsDragging] = useState(false); // drag and drop állapota
  const fileInputRef = useRef(); // input referencia
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    termeknev: '',
    tipus: '',
    meret: ''
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/add_termek', formData, { withCredentials: true });

      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
        const termek_id = response.data.termek_id;
        console.log('Termék ID:', termek_id);

        if (showImageUpload) {
          // Képek feltöltése a termék ID alapján
          const data = new FormData();
          for (let i = 0; i < images.length; i++) {
            data.append("files[]", images[i]);
          }

          try {
            await axios.post(`http://127.0.0.1:5000/api/img_upload/${termek_id}`, data, { withCredentials: true })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.error(error);
              });
          } catch (error) {
            console.log('Hiba történt:', error);
            setIsError(true);
            return;
          }
        }
        
        alert('Sikeres hozzáadás! Az oldal frissítésre kerül.');
        window.location.href = '/termekek';
      }
    } catch (error) {
      console.log('Hiba történt:', error);
      setIsError(true);
    }
  };

  const inputFields = [
    { label: 'Terméknév', name: 'termeknev', placeholder: 'Terméknév' },
    { label: 'Méret', name: 'meret', placeholder: 'Méret' }
  ];

  const types = ['Típus 1', 'Típus 2', 'Típus 3']; // Típusok listája

  const renderForm = (
    <div className='pt-4'>
      <div className="container shadow d-flex flex-column p-4">
        <h2>Termék hozzáadása</h2>
        <form onSubmit={handleSubmit} className='row g-3'>
          {inputFields.map((field, index) => (
            <div className='col-md-4' key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              <input type="text" className="form-control" id={field.name} name={field.name} onChange={handleChange} placeholder={field.placeholder} value={formData[field.name]} />
            </div>
          ))}
          <div className='col-md-4'>
            <label htmlFor="tipus">Típus</label>
            <select className="form-select" id="tipus" name="tipus" onChange={handleChange} value={formData.tipus}>
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

  return (
    <div>
      <Navbar />
      {renderForm}
    </div>
  );
}
