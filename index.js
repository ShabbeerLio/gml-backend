const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongo().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Static files route
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Log each request to /uploads
app.use('/uploads', (req, res, next) => {
    console.log(`Request for file: ${req.url}`);
    next();
});

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/service', require('./routes/service'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/blog', require('./routes/blogs'));

// Default route
app.get('/', (req, res) => {
    res.json({ message: "Hello from Gmls API" });
});
app.get('/api/auth', (req, res) => {
    res.json({ message: "auth from Gmls API" });
});
app.get('/api/service', (req, res) => {
    res.json({ message: "service from Gmls API" });
});
app.get('/api/clients', (req, res) => {
    res.json({ message: "clients from Gmls API" });
});
app.get('/api/blog', (req, res) => {
    res.json({ message: "blog from Gmls API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Gmls backend listening on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
