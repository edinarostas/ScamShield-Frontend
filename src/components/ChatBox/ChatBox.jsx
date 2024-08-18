import React from "react";
import './ChatBox.scss';

const ChatBox = ({ messages, loggedInUsername, childKey }) => {
    return (
        <section className="chat-box" key={childKey}>
            {messages.map((message, index) => (
                <div className="message-wrap" key={index}>
                    <p className={`message-sender ${message.sender === loggedInUsername ? 'message-sender--right' : 'message-sender--left'}`}>{message.sender === loggedInUsername ? 'You' : message.sender}</p>
                    <div
                        className={`message-bubble ${message.sender === loggedInUsername ? 'message-bubble--right' : 'message-bubble--left'}`}
                    >
                        <p className="message-content">{message.message}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default ChatBox;
