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
        <nav className="navbar">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/" id="mainPage">Dézsafürdő és Hordószauna Nyilvántartó Rendszer</Link>
                <button className="navbar-toggler d-md-none" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className={`navbar-menu ${isOpen ? 'show' : ''}`} id='navbarNav'>
                    {user && (
                        <>
                            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/" onClick={toggleNavbar}>Kezdőoldal</Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/raktar' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/raktar" onClick={toggleNavbar}>Raktár</Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/forgalom' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/forgalom" onClick={toggleNavbar}>Forgalom</Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/ajanlat' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/ajanlat" onClick={toggleNavbar}>Ajánlatkészítés</Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/addproduct' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/addproduct" onClick={toggleNavbar}>Termék hozzáadása</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
