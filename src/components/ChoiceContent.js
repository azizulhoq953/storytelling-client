import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import styles from '../css/ChoiceContent.module.css';  // Import the CSS module

const ChoiceContent = () => {
    const { storyId } = useParams(); // Get storyId from route parameters
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!storyId) {
            setError('Story ID is not provided');
            return;
        }
    
        const fetchStory = async () => {
            try {
                console.log('Fetching story with ID:', storyId); // Log storyId
                const response = await axiosInstance.get(`/api/stories/${storyId}`);
                console.log('Fetched story data:', response.data); // Log response

                // Directly assign the response data to story if it's an object
                if (response.data && response.data._id === storyId) {
                    setStory(response.data);
                } else {
                    setError('Story not found');
                }
            } catch (err) {
                console.error('Error fetching story:', err.response || err.message || err);
                setError('Error fetching story');
            }
        };
    
        fetchStory();
    }, [storyId]);

    if (error) return <p>{error}</p>;
    if (!story) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <h2>{story.title}</h2>
            <p className={styles.content}>{story.content}</p>
            <ul className={styles.choices}>
                {story.choices && story.choices.length > 0 ? (
                    story.choices.map((choice) => (
                        <li key={choice._id}>
                            <p>Option: {choice.optionText}</p>
                            <p>Path Content: {choice.pathContent}</p>
                        </li>
                    ))
                ) : (
                    <p className={styles.noChoices}>No choices available</p>
                )}
            </ul>
        </div>
    );
};

export default ChoiceContent;
