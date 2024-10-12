import React, { useState, useContext, useEffect } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import Activity from './Activity';
import Settings from './Settings'; 
import axios from 'axios';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);

    const { onSent, setRecentPrompt, newChat } = useContext(Context);

    const fetchChatHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.get('http://localhost:5000/chats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setChatHistory(response.data);
            } else {
                console.error('Failed to fetch chat history:', response);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

useEffect(() => {
    const fetchChatHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.get('http://localhost:5000/chats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setChatHistory(response.data);
            } else {
                console.error('Failed to fetch chat history:', response);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    fetchChatHistory();

    const intervalId = setInterval(() => {
        fetchChatHistory();
    }, 10000); // Poll every 10 seconds, or consider using WebSocket for real-time updates

    return () => clearInterval(intervalId);
}, [chatHistory]); // Dependency on chatHistory means this will rerun when chatHistory changes



    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.post('http://localhost:5000/chats', { message: prompt }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                await fetchChatHistory();
            } else {
                console.error('Failed to store chat:', response);
            }
        } catch (error) {
            console.error('Error storing chat message:', error);
        }
    };

    const deleteChat = async (chatId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.delete(`http://localhost:5000/chats/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                console.log('Chat deleted successfully:', response.data);
                setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
            } else {
                console.error('Failed to delete chat:', response);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    return (
        <div className={`sidebar ${extended ? 'expanded' : 'collapsed'}`}>
            <div className="top">
                <img
                    onClick={() => setExtended(prev => !prev)}
                    className="menu"
                    src={assets.menu_icon}
                    alt="menu"
                />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="plus icon" />
                    {extended ? <p>New chat</p> : null}
                </div>
                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {chatHistory.length > 0 ? (
                            chatHistory.map((item) => (
                                <div key={item.id} className="recent-entry">
                                    <img src={assets.message_icon} alt="message icon" onClick={() => loadPrompt(item.message)} />
                                    <p onClick={() => loadPrompt(item.message)}>{item.message}</p>
                                    <span 
                                        className="delete-option" 
                                        onClick={() => deleteChat(item.id)}
                                    >
                                        ...
                                    </span>
                                    <span className="extra-info"></span>
                                </div>
                            ))
                        ) : (
                            <p>No recent searches</p>
                        )}
                    </div>
                )}
            </div>
            <div className="bottom">
                <div
                    onClick={() => handleTabClick('activity')}
                    className={`bottom-item ${activeTab === 'activity' ? 'active' : ''}`}>
                    <img src={assets.history_icon} alt="activity" />
                    {extended && <p>Activity</p>}
                </div>
                <div
                    onClick={() => handleTabClick('settings')}
                    className={`bottom-item ${activeTab === 'settings' ? 'active' : ''}`}>
                    <img src={assets.setting_icon} alt="settings" />
                    {extended && <p className="inline-text">Settings</p>}
                </div>
            </div>
            {activeTab && (
                <div className="tab-content">
                    {activeTab === 'activity' && <Activity />}
                    {activeTab === 'settings' && <Settings />}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
