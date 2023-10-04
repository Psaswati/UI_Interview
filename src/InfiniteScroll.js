// InfiniteScroll.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function InfiniteScroll() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    `https://englishapi.pinkvilla.com/app-api/v1/photo-gallery-feed-page/page/${page}`
                );

                if (response.data.articles) {
                    const newArticles = response.data.articles;
                    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
                    setPage(page + 1);
                } else {
                    console.error('Invalid API response:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        // Add an event listener to check if the user has scrolled to the bottom
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight
            ) {
                fetchArticles();
            }
        };
        const UnixTimestampToDate = () => {
            const unixTimestamp = 1691052863 * 1000; // Convert to milliseconds
            const dateObject = new Date(unixTimestamp);
            const formattedDate = dateObject.toLocaleDateString();
        }

        window.addEventListener('scroll', handleScroll);

        // Initial load of articles
        fetchArticles();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page]);

    return (

        <div className="infinite-scroll">
            {articles.map((article, index) => (
                <div key={index} className="article">
                    <h2>{article.title}</h2>
                    <p>{article.field_photo_image_section}</p>
                    <p>Last Update: {format(new Date((article.last_update) * 1000), 'MM/dd/yyyy')}</p>
                </div>
            ))}
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default InfiniteScroll;
