import React, { useState, useEffect } from 'react';
import AdvertCard from '../../components/AdvertCard/AdvertCard';
import axios from 'axios';
import './Home.scss';

const Home = () => {
    const [adverts, setAdverts] = useState([]);

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

    const handleMessage = () => {
        alert('Message button clicked!');
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
                        onMessage={handleMessage}
                    />
                ))
            ) : (
                <p>No adverts available.</p>
            )}
        </section>
    );
};

export default Home;