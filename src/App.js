import '../src/css/index.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import CreateStory from './pages/CreateStory';
import LoginForm from './pages/LoginForm';
import ChoiceContent from './components/ChoiceContent';
import EditStory from './components/EditStory';

const App = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    let timeoutId = null;

    const toggleDropdown = () => {
        clearTimeout(timeoutId); 
        setDropdownOpen(true);
    };

    const closeDropdown = () => {
        timeoutId = setTimeout(() => {
            setDropdownOpen(false);
        }, 1000); 
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutId); // Clear timeout when hovering
        toggleDropdown();
    };

    const handleMouseLeave = () => {
        closeDropdown();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timeoutId); // Clean up on unmount
        };
    }, [timeoutId]);

    return (
        <Router>
            <div>
                <nav className="navigation">
                    <div className="logo">
                        StoryWorld
                        </div>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/create-story">Create Story</Link></li>
                        <li className="dropdown" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <a href="#">Account</a>
                            {dropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/signup">Register</Link>
                                    <Link to="/signin">Sign In</Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create-story" element={<CreateStory />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/signin" element={<LoginForm />} />
                        <Route path="/choices/:storyId" element={<ChoiceContent />} />
                        <Route path="/edit-story/:id" element={<EditStory />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;

