import { Navbar } from '..';
import React from 'react';

export default function ProductPhotos({user}) {
    return (
        <div>
            <Navbar user={user}/>
            <div className="container">
                <h1>Termék szerkesztése</h1>
            </div> 
        </div>
    );
};