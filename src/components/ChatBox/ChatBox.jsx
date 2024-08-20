import React from "react";
import './ChatBox.scss';
import AlertIcon from '../../assets/icons/alert.svg';

const ChatBox = ({ messages, loggedInUsername, childKey }) => {
    return (
        <section className="chat-box" key={childKey}>
            {messages.map((message, index) => (
                <div className="message" key={index}>
                    <p className={`message__sender ${message.sender === loggedInUsername ? 'message__sender--right' : 'message__sender--left'}`}>
                        {message.sender === loggedInUsername ? 'You' : message.sender}
                    </p>
                    <div
                        className={`message__bubble ${message.sender === loggedInUsername ? 'message__bubble--right' : 'message__bubble--left'}`}
                    >
                        <p className="message__content">{message.message}</p>
                        {message.scamAlert && message.sender !== loggedInUsername && (
                            <div className="scam-alert">
                                <img className="scam-alert__icon" src={AlertIcon} alt="Alert Icon" />
                                <span>
                                    <strong>Warning: Potential Scam!</strong><br />
                                    Please stop communicating with the sender immediately, and do not share any personal information.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default ChatBox;
