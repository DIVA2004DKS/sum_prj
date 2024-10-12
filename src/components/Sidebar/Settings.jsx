
import React, { useState, useEffect } from 'react';
import './Settings.css'; 
// Ensure you have this CSS file for styling the toggle switch

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Toggle dark mode
    const handleThemeToggle = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // Apply or remove dark mode class based on state
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    return (
        <div className="settings">
            <p>Theme</p>
            <label className="switch">
                <input 
                    type="checkbox" 
                    onChange={handleThemeToggle} 
                    checked={isDarkMode} 
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default Settings;
