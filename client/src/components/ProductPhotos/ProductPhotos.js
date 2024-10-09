import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate hozzáadása
import './ProductPhotos.css';

export default function ProductPhotos() {
    const { id: productId } = useParams();
    const [photos, setPhotos] = useState([]);
    const navigate = useNavigate(); // useNavigate hook definiálása

    const getProductPhotos = async (id) => {
        try {
            const response = await axios.get(`https://dezsanyilvantarto.hu:5000/api/images/${id}`);
            console.log("response1: ", response.data);
            const photoURLs = response.data.map(photo => ({
                id: photo.id,
                url: `https://dezsanyilvantarto.hu:5000/${photo.url.replace(/\\/g, '/')}`
            }));
            setPhotos(photoURLs);
        } catch (error) {
            console.error("Hiba a termék fotók lekérdezésekor: ", error);
        }
    };

    const deletePhoto = async (photoId) => {
        try {
            await axios.delete(`https://dezsanyilvantarto.hu:5000/api/delete_image/${photoId}`);
            const updatedPhotos = photos.filter(photo => photo.id !== photoId);
            setPhotos(updatedPhotos);
            console.log("Sikeres törlés!");

            if (updatedPhotos.length === 0) {
                alert('Minden kép törölve!');
                navigate('/raktar');
            }
        } catch (error) {
            console.error("Hiba a kép törlésekor: ", error);
        }
    };

    useEffect(() => {
        if (productId) {
            getProductPhotos(productId);
        }
    }, [productId]);

    return (
        <div>
            <div className="container">
                <h1 className='label-container'>Termék fotók</h1>
                <div className="photos-container">
                    <div className="photos">
                        {photos.map((photo, index) => (
                            <div key={index} className="photo-wrapper">
                                <img 
                                    src={photo.url} 
                                    alt={`Termék kép ${index + 1}`} 
                                />
                                <div 
                                    className="delete-icon" 
                                    onClick={() => deletePhoto(photo.id)}
                                >
                                    &times;
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
