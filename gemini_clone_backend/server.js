const express = require('express'); // Importing Express framework
const cors = require('cors'); // Importing CORS for cross-origin resource sharing
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing JSON Web Token for authentication
const { Pool } = require('pg'); // Importing pg library to interact with PostgreSQL
require('dotenv').config(); // Importing dotenv to use environment variables from a .env file
const app = express();
app.use(cors()); // Enabling CORS
app.use(express.json()); // Enabling JSON parsing for request bodies


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (validPassword) {
                const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(400).json({ error: 'Invalid Credentials' });
            }
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Invalid Token');
    }
};

// Store Chat
app.post('/chats', authenticateToken, async (req, res) => {
    const { message } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO chats (user_id, message) VALUES ($1, $2) RETURNING *',
            [req.user.id, message]
        );
        console.log('Chat stored:', result.rows[0]);  // Log stored chat
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error storing chat:', err.message);  // Log errors
        res.status(500).json({ error: err.message });
    }
});

// Get Chats
app.get('/chats', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chats WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete All Chats
app.delete('/chats', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM chats WHERE user_id = $1', [req.user.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No chat history found to delete' });
        }
        res.status(200).json({ message: 'All chat history deleted' });
    } catch (err) {
        console.error('Error deleting chat history:', err.message);  // Log detailed error
        res.status(500).json({ error: err.message });
    }
});
// Delete Specific Chat
app.delete('/chats/:id', authenticateToken, async (req, res) => {
    const chatId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM chats WHERE id = $1 AND user_id = $2', [chatId, req.user.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Chat not found or does not belong to user' });
        }
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (err) {
        console.error('Error deleting chat:', err.message);
        res.status(500).json({ error: err.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
