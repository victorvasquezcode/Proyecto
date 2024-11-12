import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">AprendiendoCODE</div>
            <nav className="nav">
                <Link to="/problems">Problems</Link>
                
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    );
};

export default Header;
