import { Navbar } from '..';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AddProduct.css';

export default function AddProduct() {
  //képfeltöltés
  const [images, setImages] = useState([]); // képek tömb
  const [isDragging, setIsDragging] = useState(false); // drag and drop állapota
  const fileInputRef = useRef(); // input referencia

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    for (const element of files) {
      if (element.type.split('/')[0] !== 'image') continue;
      if (!images.some((e) => e.name === element.name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: element.name,
            url: URL.createObjectURL(element),
          },
        ]);
      }
    }
  }

  function deleteImage(index) {
    setImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = 'copy';
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    for (const element of files) {
      if (element.type.split('/')[0] !== 'image') continue;
      if (!images.some((e) => e.name === element.name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: element.name,
            url: URL.createObjectURL(element),
          },
        ]);
      }
    }
  }

  function uploadImage() {
    console.log("Képek: ", images);
  }
  //képfeltöltés vége

  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    termeknev: '',
    tipus: '',
    meret: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/add_termek', formData);

      if (response.status === 200) {
        console.log('Sikeres hozzáadás');
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

  const isFormFilled = Object.values(formData).every(value => value !== '');

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
        </form>

        <h2>Képfeltöltés</h2> {/* drag and drop feltöltés*/}
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
            {images.map((images, index) => (
              <div className="image" key={index}>
                <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                <img src={images.url} alt={images.name} />
              </div>
            ))}
          </div>
          <button type='button' onClick={uploadImage}>
            Feltöltés
          </button>
        </div>


      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      {renderForm}
    </div>
  )
}
