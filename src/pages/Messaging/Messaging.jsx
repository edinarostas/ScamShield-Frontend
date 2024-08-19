import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messaging.scss';
import MessageHistoryCard from '../../components/MessageHistoryCard/MessageHistoryCard'
import ChatBox from '../../components/ChatBox/ChatBox'

const Messaging = () => {
    const [adverts, setAdverts] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [selectedAdvert, setSelectedAdvert] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/username', {
                        headers: { Authorization: `Bearer ${token.replaceAll('"', '')}` }
                    });
                    setLoggedInUsername(response.data.username);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };

        fetchUsername();
    }, []);

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
    }, [adverts]);

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
        <section className="messaging-page">
            <h1>{loggedInUsername}'s messages</h1>
            <div className="messaging-page__messaging">
                <section className="message-history">
                    {adverts.map(advert => (
                        advert.conversations.map(conversation => (
                            <MessageHistoryCard
                                key={conversation.id}
                                advertPhoto={advert.advertPhoto}
                                advertTitle={advert.advertTitle}
                                posterUsername={advert.username}
                                if
                                lastMessageSender={conversation.messages[conversation.messages.length - 1].sender === loggedInUsername ? 'You' : conversation.messages[conversation.messages.length - 1].sender}
                                lastMessage={conversation.messages[conversation.messages.length - 1].message}
                                onClick={() => handleConversationClick(advert, conversation)}
                            />
                        ))
                    ))}
                </section>
                {selectedConversation && selectedAdvert && (
                    <section className="current-conversation">
                        <ChatBox
                            childKey={selectedAdvert.advertId}
                            messages={selectedConversation.messages}
                            loggedInUsername={loggedInUsername}
                        />
                        <div className="reply-section">
                            <textarea
                                value={newMessage}
                                onChange={handleInputChange}
                                placeholder="Type your reply..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
};

export default Messaging;