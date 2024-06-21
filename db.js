const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://mdshabbeer707:pqf5bkUALtE1MfrG@shabbeer78.dmnutrx.mongodb.net/shabbeer78?retryWrites=true&w=majority&appName=shabbeer78"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;