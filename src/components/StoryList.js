import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../css/StoryList.css'

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState(null);
    const [optionCounts, setOptionCounts] = useState({});
    const [famousOption, setFamousOption] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axiosInstance.get('/api/stories');
                setStories(response.data);
                calculateOptionCounts(response.data);
            } catch (err) {
                setError('Error fetching stories');
            }
        };

        fetchStories();
    }, []);

    const calculateOptionCounts = (stories) => {
        const counts = {};

        stories.forEach(story => {
            story.choices.forEach(choice => {
                const option = choice.optionText;
                counts[option] = (counts[option] || 0) + 1;
            });
        });

        setOptionCounts(counts);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token is missing. Please log in.');
            return;
        }

        try {
            await axiosInstance.delete(`/api/stories/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const updatedStories = stories.filter(story => story._id !== id);
            setStories(updatedStories);
            calculateOptionCounts(updatedStories);
        } catch (err) {
            console.error('Error deleting story:', err);
            setError('Unable to delete the story. Please try again later.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-story/${id}`);
    };

    const handleFamousOptionClick = (option) => {
        setFamousOption(option);
    };

    const filterStoriesByOption = (stories, option) => {
        return stories.filter(story =>
            story.choices.some(choice => choice.optionText === option)
        );
    };

    const handleToggleLove = async (storyId) => {
        try {
            const response = await axiosInstance.post(`/api/stories/love/${storyId}`);
            const { loves, lovedByUser } = response.data;

            setStories((prevStories) =>
                prevStories.map((story) =>
                    story._id === storyId
                        ? { ...story, likes: loves, lovedByUser }
                        : story
                )
            );
        } catch (error) {
            console.error('Error toggling love:', error.response?.data || error.message);
            alert('An error occurred while toggling love. Please try again later.');
        }
    };

    const handleShowChoices = (storyId) => {
        navigate(`/choices/${storyId}`);
    };

    return (
        <div className="story-container">
            {error && <p>{error}</p>}
            
            <div className="dropdown">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {isDropdownOpen ? 'Hide-Post' : 'Filtered-Post'}
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <h3>Total Option Post Counts:</h3>
                        {Object.keys(optionCounts).length > 0 ? (
                            <ul>
                                {Object.entries(optionCounts).map(([option, count]) => (
                                    <li key={option}>
                                        <strong>Option {option}:</strong> {count}
                                        <button onClick={() => handleFamousOptionClick(option)}>
                                             Famous Option {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No options available</p>
                        )}
                    </div>
                )}
            </div>

            <div>
                <h2>{famousOption ? `Stories with Option ${famousOption}` : "Story List"}</h2>
                <ul className="story-list">
                    {(famousOption ? filterStoriesByOption(stories, famousOption) : stories).map(story => (
                        <li key={story._id} className="story-item">
                            <div className="story-header">
                                <h3>{story.title}</h3>
                                <div className="story-actions">
                                    <button className="dot-menu">
                                        <div className="dot-menu-content">
                                            <button onClick={() => handleShowChoices(story._id)}>
                                                Show Choices
                                            </button>
                                            <button onClick={() => handleDelete(story._id)}>
                                                Delete
                                            </button>
                                            <button onClick={() => handleEdit(story._id)}>
                                                Edit
                                            </button>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <p>{story.content}</p>

                            <div className="user-interaction">
                                <button
                                    className={`love-button ${story.lovedByUser ? 'active' : ''}`}
                                    onClick={() => handleToggleLove(story._id)}
                                >
                                    {story.lovedByUser ? '💔' : '❤️'} {story.likes || 0}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <footer className="story-footer">
                <p>© 2024 Interactive Story Platform. All rights reserved.</p>
                <p>
                    <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
                </p>
            </footer>
        </div>
    );
};

export default StoryList;
