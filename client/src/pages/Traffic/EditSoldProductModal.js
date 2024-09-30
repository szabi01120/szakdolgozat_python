import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditSoldProductModal = ({ show, onHide, editedProduct, onInputChange, onSaveEdit }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Termék szerkesztése</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mb-3'>
                    <label>Terméknév</label>
                    <input
                        type="text"
                        name="product_name"
                        value={editedProduct.product_name || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Bejövő számla</label>
                    <input
                        type="text"
                        name="incoming_invoice"
                        value={editedProduct.incoming_invoice || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Kimenő számla</label>
                    <input
                        type="text"
                        name="outgoing_invoice"
                        value={editedProduct.outgoing_invoice || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Típus</label>
                    <input
                        type="text"
                        name="product_type"
                        value={editedProduct.product_type || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Méret</label>
                    <input
                        type="text"
                        name="product_size"
                        value={editedProduct.product_size || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Mennyiség</label>
                    <input
                        type="number"
                        name="quantity"
                        value={editedProduct.quantity || 0}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Gyártó</label>
                    <input
                        type="text"
                        name="manufacturer"
                        value={editedProduct.manufacturer || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Nettó ár</label>
                    <input
                        type="number"
                        name="price"
                        value={editedProduct.price || 0}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label>Pénznem</label>
                    <input
                        type="text"
                        name="currency"
                        value={editedProduct.currency || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Mégse
                </Button>
                <Button variant="success" onClick={onSaveEdit}>
                    Mentés
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditSoldProductModal;
