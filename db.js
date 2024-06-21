const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://ishusaxena569:lkZGbDWcSWzpAYCa@groundbreaker.ockzixr.mongodb.net/groundbreaker?retryWrites=true&w=majority&appName=groundbreaker"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;