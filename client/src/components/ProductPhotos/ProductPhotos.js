import { Navbar } from '..';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductPhotos({ user }) {
    const { id: productId } = useParams();
    const [photos, setPhotos] = useState([]);

    const getProductPhotos = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/images/${id}`);
            const photoURLs = response.data.map(photo => `http://127.0.0.1:5000/${photo.url.replace(/\\/g, '/')}`);
            console.log("photourls: ", photoURLs);
            setPhotos(photoURLs);
        } catch (error) {
            console.error("Hiba a termék fotók lekérdezésekor: ", error);
        }
    }

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
                <div className="photos">
                    {photos.map((photo, index) => (
                        <img 
                            key={index} 
                            src={photo} 
                            alt={`Termék kép ${index + 1}`} 
                            style={{ 
                                maxWidth: '20%', 
                                maxHeight: '20%',
                                marginTop: '10px', 
                                marginRight: '10px',
                                marginBottom: '10px',
                            }} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
