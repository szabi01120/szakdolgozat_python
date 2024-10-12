import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const DeleteModal = ({ onHide, onDelete, name, deleteOptions, onDeleteOptionChange }) => {
    const [selectedItemId, setSelectedItemId] = useState('');

    const handleSelectChange = (e) => {
        const id = e.target.value;
        setSelectedItemId(id);
        onDeleteOptionChange(id);
    };

    return (
        <>
            <div className="mb-3">
                <label htmlFor="delete_item" className="form-label">{name} törlése</label>
                <Form.Select id="delete_item" value={selectedItemId} onChange={handleSelectChange}>
                    <option value="">Válassz egy {name.toLowerCase()}t</option>
                    {deleteOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </Form.Select>
            </div>
        </>
    );
};

export default DeleteModal;
