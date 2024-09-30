import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditProductModal = ({ show, onHide, editedProduct, onInputChange, onSaveEdit }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Termék szerkesztése</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="product_name" className="form-label">Termék neve</label>
            <input
              type="text"
              className="form-control"
              id="product_name"
              name="product_name"
              value={editedProduct.product_name || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="product_type" className="form-label">Típus</label>
            <input
              type="text"
              className="form-control"
              id="product_type"
              name="product_type"
              value={editedProduct.product_type || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="product_size" className="form-label">Méret</label>
            <input
              type="text"
              className="form-control"
              id="product_size"
              name="product_size"
              value={editedProduct.product_size || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Mennyiség</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={editedProduct.quantity || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="manufacturer" className="form-label">Gyártó</label>
            <input
              type="text"
              className="form-control"
              id="manufacturer"
              name="manufacturer"
              value={editedProduct.manufacturer || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Ár</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={editedProduct.price || ''}
              onChange={onInputChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Mégse
        </Button>
        <Button variant="success" onClick={onSaveEdit}>
          Mentés
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
