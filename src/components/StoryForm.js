import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../css/index.css'; // Import CSS file for styling

const StoryForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [choices, setChoices] = useState([{ optionText: '', pathContent: '' }]);
    const [error, setError] = useState(null);

    // Pre-defined options
    const predefinedOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const handleChange = (index, event) => {
        const newChoices = [...choices];
        newChoices[index][event.target.name] = event.target.value;
        setChoices(newChoices);
    };

    const handleAddChoice = () => {
        setChoices([...choices, { optionText: '', pathContent: '' }]);
    };

    const handleRemoveChoice = (index) => {
        const newChoices = choices.filter((_, i) => i !== index);
        setChoices(newChoices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate choices
        if (choices.some(choice => !choice.optionText || !choice.pathContent)) {
            setError('Each choice must have both "optionText" and "pathContent".');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token is missing. Please log in.');
            return;
        }

        try {
            await axiosInstance.post('/api/stories/create', {
                title,
                content,
                choices
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Clear form after successful submission
            setTitle('');
            setContent('');
            setChoices([{ optionText: '', pathContent: '' }]);
            setError(null);
        } catch (err) {
            setError('Error creating story');
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="story-form-container">
            <form className="story-form" onSubmit={handleSubmit}>
                {/* <h2>Create a Story</h2> */}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                {choices.map((choice, index) => (
                    <div key={index} className="choice-group">
                        <div className="form-group">
                            <label htmlFor={`optionText-${index}`}>Option:</label>
                            <select
                                id={`optionText-${index}`}
                                name="optionText"
                                value={choice.optionText}
                                onChange={(e) => handleChange(index, e)}
                                required
                            >
                                <option value="">Select an option</option>
                                {predefinedOptions.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor={`pathContent-${index}`}>Path Content:</label>
                            <textarea
                                id={`pathContent-${index}`}
                                name="pathContent"
                                value={choice.pathContent}
                                onChange={(e) => handleChange(index, e)}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="remove-choice-btn"
                            onClick={() => handleRemoveChoice(index)}
                        >
                            Remove Choice
                        </button>
                    </div>
                ))}
                <button type="button" className="add-choice-btn" onClick={handleAddChoice}>
                    Add Choice
                </button>
                <button type="submit" className="submit-btn">Create Story</button>
            </form>
        </div>
    );
};

export default StoryForm;
