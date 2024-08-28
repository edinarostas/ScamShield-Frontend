import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { v7 as uuidv7 } from 'uuid';
import './Messaging.scss';
import MessageHistoryCard from '../../components/MessageHistoryCard/MessageHistoryCard';
import ChatBox from '../../components/ChatBox/ChatBox';

const Messaging = () => {
    const [adverts, setAdverts] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUsername = async () => {
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/user/username', {
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
            const fetchedAdverts = response.data.adverts;
            setAdverts(fetchedAdverts);

            const queryParams = new URLSearchParams(location.search);
            const advertId = queryParams.get('advertId');

            if (advertId) {
                let foundAdvert = fetchedAdverts.find(advert => advert.advertId === advertId);

                if (!foundAdvert) {
                    try {
                        const advertData = await axios.get(`http://localhost:8080/adverts/${advertId}`, {
                            headers: {
                                Authorization: `Bearer ${token.replaceAll('"', '')}`,
                            },
                        });

                        foundAdvert = {
                            advertId: advertData.data.advert.id,
                            advertTitle: advertData.data.advert.title,
                            advertPhoto: advertData.data.advert.photo,
                            advertPrice: advertData.data.advert.price,
                            username: advertData.data.advert.username,
                            conversations: []
                        };

                        setAdverts(prevAdverts => [...prevAdverts, foundAdvert]);
                    } catch (error) {
                        console.log("Error fetching advert: ", error);
                    }
                }

                if (foundAdvert && foundAdvert.conversations.length > 0) {
                    setSelectedAdvert(foundAdvert);
                    setSelectedConversation(foundAdvert.conversations[0]);
                } else if (foundAdvert) {
                    const newConversation = { conversationId: uuidv7(), messages: [] };
                    foundAdvert.conversations.push(newConversation);
                    setSelectedAdvert(foundAdvert);
                    setSelectedConversation(newConversation);
                }
            }
        } catch (error) {
            console.log("Error fetching conversations and adverts: ", error);
        }
    };

    useEffect(() => {
        fetchConversationsAndAdverts();
    }, [location.search]);

    useEffect(() => {
        const intervalId = setInterval(fetchConversationsAndAdverts, 5000);

        return () => clearInterval(intervalId);
    }, [selectedConversation, location.search]);

    const handleConversationClick = (advert, conversation) => {
        setSelectedAdvert(advert);
        setSelectedConversation(conversation);
    };

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        if (selectedConversation && selectedAdvert) {
            const token = sessionStorage.getItem("token");
            const userId = sessionStorage.getItem("userId");

            const newMessageObj = {
                id: uuidv7(),
                advert_id: selectedAdvert.advertId,
                conversation_id: selectedConversation.conversationId,
                timestamp: new Date().toISOString(),
                sender: loggedInUsername,
                message: newMessage,
                scamAlert: false
            };

            try {
                await axios.post(`http://localhost:8080/messages/${selectedAdvert.advertId}/conversations/${selectedConversation.conversationId}`, newMessageObj, {
                    headers: {
                        Authorization: `Bearer ${token.replaceAll('"', '')}`,
                    },
                });

                const updatedConversation = {
                    ...selectedConversation,
                    messages: [
                        ...selectedConversation.messages,
                        newMessageObj
                    ]
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
                        <div key={advert.advertId}>
                            {advert.conversations.length > 0 ? (
                                advert.conversations
                                    .sort((a, b) => new Date(b.messages[b.messages.length - 1]?.timestamp || 0) - new Date(a.messages[a.messages.length - 1]?.timestamp || 0))
                                    .map(conversation => (
                                        <MessageHistoryCard
                                            key={conversation.conversationId}
                                            advertPhoto={advert.advertPhoto}
                                            advertTitle={advert.advertTitle}
                                            posterUsername={advert.username}
                                            lastMessageSender={conversation.messages[conversation.messages.length - 1]?.sender === loggedInUsername ? 'You' : conversation.messages[conversation.messages.length - 1]?.sender}
                                            lastMessage={conversation.messages[conversation.messages.length - 1]?.message || 'Start a new conversation'}
                                            onClick={() => handleConversationClick(advert, conversation)}
                                            isSelected={selectedConversation && selectedConversation.conversationId === conversation.conversationId}
                                        />
                                    ))
                            ) : (
                                <MessageHistoryCard
                                    key={advert.advertId}
                                    advertPhoto={advert.advertPhoto}
                                    advertTitle={advert.advertTitle}
                                    posterUsername={advert.username}
                                    lastMessageSender="You"
                                    lastMessage="Start a new conversation"
                                    onClick={() => handleConversationClick(advert, null)}
                                    isSelected={selectedAdvert && selectedAdvert.advertId === advert.advertId}
                                />
                            )}
                        </div>
                    ))}
                </section>
                {selectedConversation && selectedAdvert && (
                    <section className="current-conversation">
                        <ChatBox
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
