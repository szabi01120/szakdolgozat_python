import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const DeleteModal = ({ show, onHide, message, variant, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title>Értesítés</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant={variant} style={{ backgroundColor: '#f8d7da' }}>
                    {message}
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    Mégse
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Törlés
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteModal;