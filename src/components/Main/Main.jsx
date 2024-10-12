import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [copied, setCopied] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    let code = '';
    let explanation = '';
    let language = 'javascript'; // Default language

    if (resultData) {
        const codeMatch = resultData.match(/```(\w+)\n([\s\S]*?)```/);
        if (codeMatch) {
            language = codeMatch[1]; // Extract language
            code = codeMatch[2].trim();
        }

        explanation = resultData.replace(/```(\w+)\n[\s\S]*?```/, '').trim();
        explanation = explanation
            .replace(/\n/g, '<br/>')
            .replace(/\*/g, '*')  // Ensure * are printed as *
            .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
    }

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    };

    const handleLogout = () => {
        setLoggingOut(true);
        setTimeout(() => {
            localStorage.removeItem('token');
            navigate('/');
        }, 2000); // Wait for 2 seconds before logging out
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        await onSent(input); // This now updates the context with the new chat
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await axios.post('http://localhost:5000/chats', { message: input }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setInput(''); // Clear input after sending
    
        } catch (error) {
            console.error('Error storing chat:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className='main'>
            <div className="nav">
                <p>AnnaAI</p>
                <button className="explore-button" onClick={() => window.location.href = 'http://localhost:8501'}>
                    Explore
                </button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <div className="main-container">
                {loggingOut ? (
                    <div className="logging-out-message">Logging out...</div>
                ) : !showResult ? (
                    <>
                        <div className="greet">
                            <p><span>WELCOME, CODERS!</span></p>
                            <p>GET YOUR NEEDS FROM AnnaAI</p>
                        </div>
                        <div className="cards">
                            {/* Cards are rendered here */}
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <p>{recentPrompt}</p>
                        </div>

                        <div className="result-data">
                            {loading ? (
                                <div className='loader'>
                                    <hr /><hr /><hr />
                                </div>
                            ) : (
                                <div>
                                    {code && (
                                        <>
                                            <div className="code-header">
                                                <p>Language: {language}</p>
                                                <CopyToClipboard text={code} onCopy={handleCopy}>
                                                    <button className="copy-button">Copy Code</button>
                                                </CopyToClipboard>
                                                {copied && <span className="copy-message">Copied!</span>}
                                            </div>
                                            <SyntaxHighlighter language={language} style={dark}>
                                                {code}
                                            </SyntaxHighlighter>
                                        </>
                                    )}
                                    {explanation && (
                                        <div
                                            className="explanation"
                                            dangerouslySetInnerHTML={{ __html: explanation }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="main-bottom">
                <div className="search-box">
                    <input
                        ref={inputRef}
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Ask Your Questions Here'
                        onKeyPress={handleKeyPress}
                    />
                    <div>
                        {input ? <img onClick={handleSend} src={assets.send_icon} alt="send icon" /> : null}
                    </div>
                </div>
                <p className="bottom-info">
                      AnnaAI may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini responses.
                </p>
            </div>
        </div>
    );
};

export default Main;
