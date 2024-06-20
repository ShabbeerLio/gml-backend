const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://shabbeerlio707:NDUPyPbt8AlF16zY@groundbreaker.z2htm3b.mongodb.net/groundbreaker?retryWrites=true&w=majority&appName=groundbreaker"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;