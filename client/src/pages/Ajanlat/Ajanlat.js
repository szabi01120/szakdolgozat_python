import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Axios importálása
import { Navbar } from '../../components';
import './Ajanlat.css';

export default function Ajanlat({ user }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [template, setTemplate] = useState('default');

  const [templates, setTemplates] = useState(['default', 'simple', 'detailed']); // Alapértelmezett sablonok

  // árajánlat messages
  const [successMessageQuotation, setSuccessMessageQuotation] = useState('');
  const [errorMessageQuotation, setErrorMessageQuotation] = useState('');
  
  // sablon hozzáadás messages
  const [successMessageTemplate, setSuccessMessageTemplate] = useState('');
  const [errorMessageTemplate, setErrorMessageTemplate] = useState('');
  

  // Sablon hozzáadásához szükséges állapotok
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Új sablon hozzáadása
  const handleAddTemplate = async () => {
    if (!newTemplateName || !newTemplateContent) {
      setErrorMessageTemplate('A sablon neve és tartalma nem lehet üres.');
      return;
    }

    const newTemplate = {
      template_name: newTemplateName,
      template_content: newTemplateContent,
    };

    try {
      const response = await axios.post('/api/add_template', newTemplate);
      if (response.status === 200) {
        setSuccessMessageTemplate('Sablon sikeresen hozzáadva!');
        setErrorMessageTemplate('');
        setTemplates([...templates, newTemplateName]); // Hozzáadjuk a legördülő listához
        setNewTemplateName('');
        setNewTemplateContent('');
      }
    } catch (error) {
      console.error('Hiba történt a sablon hozzáadása során:', error);
      setErrorMessageTemplate('Hiba történt a sablon hozzáadása során.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const quotationData = {
      customerName,
      customerEmail,
      productName,
      productPrice,
      quantity,
      template
    };

    try {
      const response = await axios.post('/api/send_quotation', quotationData);
      if (response.status === 200) {
        setSuccessMessageQuotation('Az ajánlat sikeresen elküldve!');
        setErrorMessageQuotation('');
        // Űrlap alaphelyzetbe állítása sikeres küldés után
        setCustomerName('');
        setCustomerEmail('');
        setProductName('');
        setProductPrice('');
        setQuantity(1);
        setTemplate('default');
      }
    } catch (error) {
      console.log(quotationData);
      console.error('Hiba történt:', error);
      setErrorMessageQuotation(error.response?.data?.message || 'Hiba történt az ajánlat küldése során.');
      setSuccessMessageQuotation('');
    }
  };

  return (
    <div className="ajanlat-container">
      <Navbar user={user} />
      <div className="form-container">
        <h1>Árajánlat</h1>
        {successMessageQuotation && <p className="success-message">{successMessageQuotation}</p>}
        {errorMessageQuotation && <p className="error-message">{errorMessageQuotation}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Ügyfél neve:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
          <label>
            Ügyfél e-mail címe:
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Termék neve:
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </label>
          <label>
            Termék nettó ára:
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Mennyiség:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </label>
          <label>
            Sablon:
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Ajánlat küldése</button>
        </form>
      </div>

      {/* Sablon hozzáadása form */}
      <div className="template-add-container">
        <h2>Új sablon hozzáadása</h2>
        {errorMessageTemplate && <p className="error-message">{errorMessageTemplate}</p>}
        {successMessageTemplate && <p className="success-message">{successMessageTemplate}</p>}
        <label>
          Sablon neve:
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            required
          />
        </label>
        <label>
          Sablon tartalma:
          <textarea
            value={newTemplateContent}
            onChange={(e) => setNewTemplateContent(e.target.value)}
            required
          />
        </label>
        <button onClick={handleAddTemplate}>Sablon hozzáadása</button>
      </div>
    </div>
  );
}
