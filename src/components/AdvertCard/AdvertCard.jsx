import React from "react";
import './AdvertCard.scss'

const AdvertCard = ({ photo, title, price, username, onMessage }) => {
    return (
        <div className="advert-card">
            <img className="advert-card__image" src={photo} alt={title} />
            <div className="advert-card__details">
                <h2 className="advert-card__title">{title}</h2>
                <p className="advert-card__price">${price}</p>
                <p className="advert-card__username">Posted by: {username}</p>
                <button className="advert-card__message" onClick={onMessage}>
                    Message
                </button>
            </div>
        </div>
    );
};

export default AdvertCard;