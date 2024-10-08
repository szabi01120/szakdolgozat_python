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
                    <label htmlFor="product_name">Terméknév</label>
                    <input
                        type="text"
                        id="product_name"
                        name="product_name"
                        value={editedProduct.product_name || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="incoming_invoice">Bejövő számla</label>
                    <input
                        type="text"
                        id="incoming_invoice"
                        name="incoming_invoice"
                        value={editedProduct.incoming_invoice || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="outgoing_invoice">Kimenő számla</label>
                    <input
                        type="text"
                        id="outgoing_invoice"
                        name="outgoing_invoice"
                        value={editedProduct.outgoing_invoice || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="product_type">Típus</label>
                    <input
                        type="text"
                        id="product_type"
                        name="product_type"
                        value={editedProduct.product_type || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="customer_name">Vásárló neve</label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={editedProduct.customer_name || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="manufacturer">Gyártó</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={editedProduct.manufacturer || ''}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="incoming_price">Beszerzési ár</label>
                    <input
                        type="number"
                        id="incoming_price"
                        name="incoming_price"
                        value={editedProduct.incoming_price || 0}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="selling_price">Eladási ár</label>
                    <input
                        type="number"
                        id="selling_price"
                        name="selling_price"
                        value={editedProduct.selling_price || 0}
                        onChange={onInputChange}
                        className="form-control"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="currency">Pénznem</label>
                    <input
                        type="text"
                        id="currency"
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
