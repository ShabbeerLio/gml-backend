const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://gmlsdatabase:fUmuZgRFFQ8y4KcO@gmls.pxxkocf.mongodb.net/gmls?retryWrites=true&w=majority&appName=gmls"

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
}

module.exports = connectToMongo;