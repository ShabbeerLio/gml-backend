const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
connectToMongo();

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) =>
    res.json({message:"hello frorm Gmls api"})
  );

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
// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/service', require('./routes/service'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/blog', require('./routes/blogs'));

// Start server
app.listen(PORT, () => {
    console.log(`Gmls backend listening on port ${PORT}`);
});