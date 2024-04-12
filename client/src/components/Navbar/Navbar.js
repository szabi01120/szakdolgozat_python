import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function MyNavbar() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-md fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/" id="mainPage">Dézsafürdő és Hordószauna Nyilvántartó Rendszer</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/">Kezdőoldal</Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/termekek' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/termekek">Termékek</Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/forgalom' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/forgalom">Forgalom</Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/raktar' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/raktar">Raktár</Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/ajanlat' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/ajanlat">Ajánlatkészítés</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
