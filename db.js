const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb://localhost:27017"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;