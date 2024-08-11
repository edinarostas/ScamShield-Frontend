import React from 'react';
import './Footer.scss'


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__wrapper">
                <p className="footer__content">
                    <small className="footer__copyright">
                        &copy; ScamShield Inc. All Rights Reserved.
                    </small>
                </p>
            </div>
        </footer>
    )
}

export default Footer;