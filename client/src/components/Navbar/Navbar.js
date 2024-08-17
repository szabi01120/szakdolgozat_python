import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function MyNavbar({ user }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar navbar-expand-md fixed-top">
            <div className="container">
                <Link className="navbar-brand mr-auto" to="/" id="mainPage">Dézsafürdő és Hordószauna Nyilvántartó Rendszer</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user && (
                            <>
                                <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                                    <Link className="nav-link" to="/">Kezdőoldal</Link>
                                </li>
                                <li className={`nav-item ${location.pathname === '/raktar' ? 'active' : ''}`}>
                                    <Link className="nav-link" to="/raktar">Raktár</Link>
                                </li>
                                <li className={`nav-item ${location.pathname === '/forgalom' ? 'active' : ''}`}>
                                    <Link className="nav-link" to="/forgalom">Forgalom</Link>
                                </li>
                                <li className={`nav-item ${location.pathname === '/ajanlat' ? 'active' : ''}`}>
                                    <Link className="nav-link" to="/ajanlat">Ajánlatkészítés</Link>
                                </li>
                                <li className={`nav-item ${location.pathname === '/addproduct' ? 'active' : ''}`}>
                                    <Link className="nav-link" to="/addproduct">Termék hozzáadása</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
