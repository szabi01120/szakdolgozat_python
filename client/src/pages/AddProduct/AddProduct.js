import { Navbar } from '../../components';
import React, { useState } from 'react';
import axios from 'axios';

export default function AddProduct() {

  const [isSubmitted, setIsSubmitted] = useState(false);
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
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.href = '/termekek';
        }, 2000);
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
        <table className="table">
          <thead>
            <tr>
              <th>Fejléc 1</th>
              <th>Fejléc 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adat 1</td>
              <td>Adat 2</td>
            </tr>
            {/* További sorok hozzáadása a táblázathoz */}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      {isSubmitted ?
        <div>
          <h1 className='text-center'>Sikeres hozzáadás!</h1>
        </div> : renderForm}
    </div>
  )
}
