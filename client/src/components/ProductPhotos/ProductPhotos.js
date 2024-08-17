import { Navbar } from '..';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPhotos.css';

export default function ProductPhotos({ user }) {
    const { id: productId } = useParams();
    const [photos, setPhotos] = useState([]);

    const getProductPhotos = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/images/${id}`);
            console.log("response1: ", response.data);
            const photoURLs = response.data.map(photo => ({
                id: photo.id, 
                url: `http://127.0.0.1:5000/${photo.url.replace(/\\/g, '/')}`
            }));
            setPhotos(photoURLs);
        } catch (error) {
            console.error("Hiba a termék fotók lekérdezésekor: ", error);
        }
    };

    const deletePhoto = async (photoId) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/delete_image/${photoId}`);
            setPhotos(photos.filter(photo => photo.id !== photoId));
            console.log("Sikeres törlés!");
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
            <Navbar user={user} />
            <div className="container">
                <h1>Termék fotók</h1>
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
