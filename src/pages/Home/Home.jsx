import React from 'react';
import AdvertCard from '../../components/AdvertCard/AdvertCard';
import './Home.scss'
import AdvertData from '../../data/data.json'


const Home = () => {
    const handleMessage = () => {
        alert('Message button clicked!');
    };

    return (
        <section className='adverts'>
            {AdvertData.map((advert) => (
                <AdvertCard
                    key={advert.id}
                    photo={advert.photo}
                    title={advert.title}
                    price={advert.price}
                    username={advert.username}
                    onMessage={handleMessage}
                />
            ))}
        </section>
    )
}

export default Home; 