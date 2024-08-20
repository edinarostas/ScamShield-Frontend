import React from "react";
import './MessageHistoryCard.scss';

const MessageHistoryCard = ({ childKey, advertPhoto, advertTitle, posterUsername, lastMessageSender, lastMessage, onClick, isSelected }) => {
    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.slice(0, maxLength) + '...';
        }
        return message;
    };

    return (
        <div className={`message-history-card ${isSelected ? 'selected' : ''}`} onClick={onClick} key={childKey}>
            <div className="advert-details">
                <img src={advertPhoto} alt={advertTitle} className="advert-detail__photo" />
                <p className="advert-detail__poster-username">{posterUsername} </p>
                <p>-</p>
                <p className="advert-detail__title"> {advertTitle}</p>
            </div>
            <div className="message-details">
                <strong>{lastMessageSender}:</strong> {lastMessage && (truncateMessage(lastMessage, 50))}
            </div>
        </div>
    );
}

export default MessageHistoryCard;
