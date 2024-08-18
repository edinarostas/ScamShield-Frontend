import React from "react";
import './MessageHistoryCard.scss';

const MessageHistoryCard = ({ key, advertPhoto, advertTitle, posterUsername, lastMessageSender, lastMessage, onClick }) => {
    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.slice(0, maxLength) + '...';
        }
        return message;
    };

    return (
        <div className="message-history-card" onClick={onClick} key={key}>
            <div className="advert-details">
                <img src={advertPhoto} alt={advertTitle} className="advert-detail__photo" />
                <p className="advert-detail__poster-username">{posterUsername} -</p>
                <p className="advert-detail__title"> {advertTitle}</p>
            </div>
            <div className="message-details">
                <strong>{lastMessageSender}:</strong> {truncateMessage(lastMessage, 50)}
            </div>
        </div>
    );
}

export default MessageHistoryCard;
