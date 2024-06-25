const express = require('express')
var cors = require('cors')
const connectToMongo = require('./db');
const path = require('path');

connectToMongo();
const app = express()
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Avialiable routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/service', require('./routes/service'))
app.use('/api/clients', require('./routes/clients'))
app.use('/api/blog', require('./routes/blogs'))


app.listen(PORT, () => {
    console.log(`Gmls backend listening on port ${PORT}`)
})
