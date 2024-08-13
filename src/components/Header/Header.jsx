import React from 'react';
import { Link } from 'react-router-dom'
import './Header.scss'


const Header = () => {
    return (
        <header className="header">
            <div className="header__wrapper">
                <nav className="header__nav">
                    <Link className="header__logo" to="/">
                        ScamShield
                    </Link>
                    <ul className="header__list">
                        <li className="header__list-item">
                            <Link className="header__link" to="/home">
                                Home
                            </Link>
                            <Link className="header__link" to="/messaging">
                                Messaging
                            </Link>
                            <Link className="header__link" to="/logout">
                                Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;