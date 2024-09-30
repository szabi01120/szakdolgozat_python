import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const NotificationModal = ({ show, onHide, message, variant }) => {
    const bgColor = variant === 'success' ? '#d4edda' : '#f8d7da';

    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title>{variant === 'success' ? 'Értesítés' : 'Hiba'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant={variant} style={{ backgroundColor: {bgColor} }}>
                    {message}
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Bezárás
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;
