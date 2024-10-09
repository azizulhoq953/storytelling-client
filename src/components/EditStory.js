import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EditStory = () => {
    const { state } = useLocation();
    const { id } = useParams(); // Get the story ID from the URL params
    const [story, setStory] = useState(state?.story || { title: '', content: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.story) {
            // If the story wasn't passed in the state, fetch it from the server
            const fetchStory = async () => {
                try {
                    const response = await axiosInstance.get(`/api/stories/${id}`);
                    setStory(response.data);
                } catch (err) {
                    setError('Error fetching story details.');
                }
            };

            fetchStory();
        }
    }, [id, state]);

    const handleChange = (e) => {
        setStory({ ...story, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token is missing. Please log in.');
            return;
        }

        try {
            await axiosInstance.put(`/api/stories/edit/${id}`, story, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError('Error updating the story.');
        }
    };



    return (
        <div>
            <h2>Edit Story</h2>
            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={story.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={story.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Story</button>
            </form>
        </div>
    );
};

export default EditStory;
