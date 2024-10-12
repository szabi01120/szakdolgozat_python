import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DeleteModal from './DeleteModal';

const AddModal = ({ show, onHide, onInputChange, onSaveEdit, name, inputValue, deleteOptions, onDelete }) => {
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [selectedDeleteOption, setSelectedDeleteOption] = useState(null);

  const handleCheckboxChange = (e) => {
    setShowDeleteSection(e.target.checked);
  };

  const handleDeleteOptionChange = (selectedOption) => {
    setSelectedDeleteOption(selectedOption);
  };

  const handleDeleteButtonClick = () => {
    if (!selectedDeleteOption) {
      alert(`Kérjük, válasszon egy ${name.toLowerCase()}t a törléshez!`);
      return;
    }

    const confirm = window.confirm(`Biztosan törölni szeretné a(z) ${selectedDeleteOption} elemet?`);
    if (confirm) {
      onDelete(selectedDeleteOption);
      onHide();
      setSelectedDeleteOption(null);
      setShowDeleteSection(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{name} hozzáadása</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="type_or_manufacturer" className="form-label">{name} neve</label>
            <input
              type="text"
              className="form-control"
              id="type_or_manufacturer"
              value={inputValue || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="checkbox"
              label="Törlés engedélyezése"
              checked={showDeleteSection}
              onChange={handleCheckboxChange}
            />
          </div>
          {showDeleteSection && (
            <DeleteModal
              onHide={onHide}
              onDelete={onDelete}
              name={name}
              deleteOptions={deleteOptions}
              onDeleteOptionChange={handleDeleteOptionChange}
            />
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Mégse
        </Button>
        <Button variant="edit" onClick={onSaveEdit}>
          Hozzáadás
        </Button>
        {showDeleteSection && selectedDeleteOption && (
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            {name} törlése
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddModal;
