const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://ishusaxena569:ADZacS26UScjSynK@cluster0.hbgomsf.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0"


const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;