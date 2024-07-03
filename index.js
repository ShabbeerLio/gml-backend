const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');

// Connect to MongoDB
connectToMongo();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/service', require('./routes/service'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/blog', require('./routes/blogs'));

// Start server
app.listen(PORT, () => {
    console.log(`Gmls backend listening on port ${PORT}`);
});