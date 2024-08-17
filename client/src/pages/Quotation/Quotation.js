import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../../components';
import './Quotation.css';

export default function Quotation({ user }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [template, setTemplate] = useState(''); // aktuálisan kiválasztott template
  const [templates, setTemplates] = useState([]); // összes template amiből választani lehet

  // árajánlat messages
  const [successMessageQuotation, setSuccessMessageQuotation] = useState('');
  const [errorMessageQuotation, setErrorMessageQuotation] = useState('');

  // sablon hozzáadás messages
  const [successMessageTemplate, setSuccessMessageTemplate] = useState('');
  const [errorMessageTemplate, setErrorMessageTemplate] = useState('');

  // sablon törlés messages
  const [successMessageDeleteTemplate, setSuccessMessageDeleteTemplate] = useState('');
  const [errorMessageDeleteTemplate, setErrorMessageDeleteTemplate] = useState('');

  // Sablon hozzáadásához szükséges állapotok
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Törlésre kiválasztott sablon állapota
  const [selectedTemplateToDelete, setSelectedTemplateToDelete] = useState('');

  // Accordion megjelenítés állapot
  const [accordionData, setAccordionData] = useState(false);

  // Sablonok lekérése a /api/templates végpontról
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates');
        console.log('Sablonok:', response.data);
        setTemplates(response.data);
        // ha nincs sablon, akkor valamilyen szöveg
        if (response.data.length === 0) {
          setTemplate('no-template');
        }
      } catch (error) {
        console.error('Hiba történt a sablonok lekérése során:', error);
      }
    };

    fetchTemplates();
  }, []);

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
      if (response.status === 201) {
        setSuccessMessageTemplate('Sablon sikeresen hozzáadva!');
        setErrorMessageTemplate('');
        setTemplates([...templates, newTemplateName]); // Hozzáadjuk a legördülő listához
        setNewTemplateName('');
        setNewTemplateContent('');
        console.log('Sablon hozzáadva:', newTemplate);
        setTemplate(newTemplateName); // Új sablon kiválasztása
      }
    } catch (error) {
      console.error('Hiba történt a sablon hozzáadása során:', error);
      setErrorMessageTemplate('Hiba történt a sablon hozzáadása során.');
    }
  };

  // Sablon törlése
  const handleDeleteTemplate = async () => {
    if (!selectedTemplateToDelete) {
      setErrorMessageDeleteTemplate('Nincs kiválasztva sablon a törléshez.');
      return;
    }

    const templateToDelete = {
      template_name: selectedTemplateToDelete,
    };

    try {
      const response = await axios.delete('/api/delete_template', { data: templateToDelete });
      if (response.status === 200) {
        setSuccessMessageDeleteTemplate('Sablon sikeresen törölve!');
        setErrorMessageDeleteTemplate('');
        const updatedTemplates = templates.filter(template => template !== selectedTemplateToDelete);
        setTemplates(updatedTemplates); // Eltávolítjuk a legördülő listából
        setSelectedTemplateToDelete('');

        if (updatedTemplates.length === 0) {
          setTemplate('no-template'); // Ha már nincs sablon, állítsuk be a "Nincs elérhető sablon" szöveget
        }
        console.log('Sablon törölve:', response.data);
      }
    } catch (error) {
      console.log(selectedTemplateToDelete);
      console.error('Hiba történt a sablon törlése során:', error);
      setErrorMessageDeleteTemplate('Hiba történt a sablon törlése során.');
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
        setCustomerName('');
        setCustomerEmail('');
        setProductName('');
        setProductPrice('');
        setQuantity(1);
        setTemplate(templates.length > 0 ? templates[0] : 'no-template');
      }
    } catch (error) {
      console.log(quotationData);
      console.error('Hiba történt:', error);
      setErrorMessageQuotation(error.response?.data?.message || 'Hiba történt az ajánlat küldése során.');
      setSuccessMessageQuotation('');
    }
  };

  // Accordion gomb kattintás
  const handleAccordionButtonClick = () => {
    setAccordionData(!accordionData);
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="ajanlat-container">
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
                disabled={templates.length === 0} // ha nincs sablon letiltjuk a legördülőt
              >
                {templates.length === 0 ? (
                  <option value="no-template">Nincs elérhető sablon</option>
                ) : (
                  templates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))
                )}
              </select>
            </label>
            <button type="submit" disabled={template === 'no-template'}>Ajánlat küldése</button>
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
          <div className="accordion" id="leirasAccord">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                  onClick={handleAccordionButtonClick}>

                  Sablon tartalom leírás
                </button>
              </h2>
              {accordionData &&
                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    Az ajánlatkészítés max 5 változóval rendelkezik, hivatkozni rájuk "{"{ }"}" lehet. <br /><br />
                    Tehát a sablon tartalmának meg kell adni
                    a változókat, pl.: <strong>{"{customerName}"}</strong>.<br /><br />
                    Ezek a változók:
                    <ul>
                      <li><strong>{"{customer_name}"}</strong> - Ügyfél neve</li>
                      <li><strong>{"{customer_mail}"}</strong> - Ügyfél e-mail címe</li>
                      <li><strong>{"{product_name}"}</strong> - Termék neve</li>
                      <li><strong>{"{product_price}"}</strong> - Termék nettó ára</li>
                      <li><strong>{"{quantity}"}</strong> - Mennyiség</li>
                    </ul>
                  </div>
                </div>
              }
            </div>
          </div>

          <button onClick={handleAddTemplate}>Sablon hozzáadása</button>

          {/* Sablon törlése form - csak akkor jelenik meg, ha van sablon */}
          {templates.length > 0 && (
            <div className="template-delete-container">
              <h2 className='mt-5'>Sablon törlése</h2>
              <label>
                Törölni kívánt sablon:
                <select
                  value={selectedTemplateToDelete}
                  onChange={(e) => setSelectedTemplateToDelete(e.target.value)}
                >
                  <option value="">Válasszon sablont</option>
                  {templates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
              </label>
              {errorMessageDeleteTemplate && <p className="error-message">{errorMessageDeleteTemplate}</p>}
              {successMessageDeleteTemplate && <p className="success-message">{successMessageDeleteTemplate}</p>}
              <button onClick={handleDeleteTemplate} id='deleteButton' disabled={!selectedTemplateToDelete}>Sablon törlése</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}