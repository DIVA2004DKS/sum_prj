import React from 'react';

const Activity = () => {
    const clearAllChats = async () => {
        try {
            const response = await fetch('http://localhost:5000/chats', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to clear chat history');
            }
    
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };
    

    return (
        <div className="activity">
            <ul>
                <li onClick={clearAllChats} style={{ cursor: 'pointer' }}>Clear All</li>
            </ul>
        </div>
    );
};

export default Activity;
