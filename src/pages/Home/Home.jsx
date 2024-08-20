import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdvertCard from '../../components/AdvertCard/AdvertCard';
import './Home.scss';

const Home = () => {
    const [adverts, setAdverts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdverts();
    }, []);

    const fetchAdverts = async () => {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");

        if (!token || !userId) {
            return false;
        }

        try {
            const response = await axios.get(`http://localhost:8080/adverts/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token.replaceAll('"', '')}`,
                },
            });
            setAdverts(response.data.adverts);
        } catch (error) {
            console.log("Error happened while fetching adverts: ", error);
        }
    };

    const handleSendNewMessage = (advertId) => {
        navigate(`/messaging?advertId=${advertId}`);
    };

    return (
        <section className='adverts'>
            {adverts.length > 0 ? (
                adverts.map((advert) => (
                    <AdvertCard
                        key={advert.id}
                        photo={advert.photo}
                        title={advert.title}
                        price={advert.price}
                        username={advert.username}
                        onMessage={() => handleSendNewMessage(advert.id)}
                    />
                ))
            ) : (
                <p>No adverts available.</p>
            )}
        </section>
    );
};

export default Home;