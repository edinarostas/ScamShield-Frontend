import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messaging.scss';

const Messaging = () => {
    const [adverts, setAdverts] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [selectedAdvert, setSelectedAdvert] = useState(null);


    useEffect(() => {
        const fetchConversationsAndAdverts = async () => {
            const token = sessionStorage.getItem("token");
            const userId = sessionStorage.getItem("userId");

            if (!token || !userId) {
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/messages/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token.replaceAll('"', '')}`,
                    },
                });
                setAdverts(response.data.adverts);

            } catch (error) {
                console.log("Error fetching conversations and adverts: ", error);
            }
        };

        fetchConversationsAndAdverts();
    }, []);

    // Handle conversation click to show messages
    const handleConversationClick = (advert, conversation) => {
        setSelectedAdvert(advert);
        setSelectedConversation(conversation);
    };

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedConversation && selectedAdvert) {
            const token = sessionStorage.getItem("token");
            const userId = sessionStorage.getItem("userId");

            const newMessageObj = {
                message: newMessage,
            };

            try {
                await axios.post(`http://localhost:8080/messages/${selectedAdvert.advertId}/conversations/${selectedConversation.conversationId}`, newMessageObj, {
                    headers: {
                        Authorization: `Bearer ${token.replaceAll('"', '')}`,
                    },
                });

                const updatedConversation = {
                    ...selectedConversation,
                    messages: [...selectedConversation.messages, {
                        id: selectedConversation.messages.length + 1,
                        timestamp: new Date().toISOString(),
                        sender: userId,
                        message: newMessage,
                    }]
                };

                setAdverts(adverts.map(advert =>
                    advert.advertId === selectedAdvert.advertId ? {
                        ...advert,
                        conversations: advert.conversations.map(conversation =>
                            conversation.conversationId === selectedConversation.conversationId
                                ? updatedConversation
                                : conversation
                        )
                    } : advert
                ));
                setNewMessage('');
                setSelectedConversation(updatedConversation);
            } catch (error) {
                console.log("Error sending message: ", error);
            }
        }
    };

    return (
        <section>
            <h1>Messaging user: {sessionStorage.getItem("userId")}</h1>
            <div className="advert-list">
                {adverts.map(advert => (
                    <div key={advert.advertId} className="advert-item">
                        <h2>{advert.advertTitle}</h2>
                        {/* <img src={advert.advertPhoto} alt={advert.advertTitle} /> */}
                        <p>Price: ${advert.advertPrice}</p>
                        <div className="conversation-list">
                            {advert.conversations.map(conversation => (
                                <div
                                    key={conversation.conversationId}
                                    className={`conversation-item ${selectedConversation?.conversationId === conversation.conversationId ? 'selected' : ''}`}
                                    onClick={() => handleConversationClick(advert, conversation)}
                                >
                                    <h5>Conversation with {conversation.messages[0].sender}</h5>
                                    <p>
                                        {conversation.messages[conversation.messages.length - 1].sender}: {conversation.messages[conversation.messages.length - 1].message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {selectedConversation && selectedAdvert && (
                <>
                    <div className="message-list">
                        {selectedConversation.messages.map(message => (
                            <div
                                key={message.messageId}
                                className={`message-item ${message.sender === 'YourUsername' ? 'sent' : 'received'}`}
                            >
                                <span>{message.sender}: </span>{message.message}
                            </div>
                        ))}
                    </div>
                    <div className="reply-section">
                        <textarea
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type your reply..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            )}
        </section>
    );
};

export default Messaging;