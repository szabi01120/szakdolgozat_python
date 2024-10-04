import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faExchangeAlt, faFileInvoice, faPlusCircle } from '@fortawesome/free-solid-svg-icons'; // Import icons
import './Navbar.css';

export default function MyNavbar({ user }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavClick = () => {
        // Ha egy menüpontra kattintunk, akkor zárja be a menüt
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/" id="mainPage">
                    Dézsafürdő és Hordószauna Nyilvántartó Rendszer
                </Link>
                <button className="navbar-toggler d-md-none" onClick={toggleNavbar}>
                    <span className={`navbar-toggler-icon ${isOpen ? 'open' : ''}`}></span>
                </button>
                <ul className={`navbar-menu ${isOpen ? 'show' : ''}`} id='navbarNav'>
                    {user && (
                        <>
                            <li className={`nav-item ${location.pathname === '/raktar' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/raktar" onClick={handleNavClick}>
                                    <FontAwesomeIcon icon={faWarehouse} /> Raktár
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/forgalom' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/forgalom" onClick={handleNavClick}>
                                    <FontAwesomeIcon icon={faExchangeAlt} /> Forgalom
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/ajanlat' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/ajanlat" onClick={handleNavClick}>
                                    <FontAwesomeIcon icon={faFileInvoice} /> Ajánlatkészítés
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/addproduct' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/addproduct" onClick={handleNavClick}>
                                    <FontAwesomeIcon icon={faPlusCircle} /> Termék hozzáadása
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
