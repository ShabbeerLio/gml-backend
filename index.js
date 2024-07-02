const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
connectToMongo();

const app = express();

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
    // console.log(`Request for file: ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => res.json({message: "hello from Gmls api"}));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/service', require('./routes/service'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/blog', require('./routes/blogs'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app for Vercel to handle
module.exports = app;
