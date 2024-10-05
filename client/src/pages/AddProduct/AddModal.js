import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddModal = ({ show, onHide, onInputChange, onSaveEdit, name, inputValue }) => {
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
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Mégse
        </Button>
        <Button variant="primary" onClick={onSaveEdit}>
          Mentés
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModal;
