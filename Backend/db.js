import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

const uri = process.env.MONGODB_URI;

const connectToMongo = ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
}

export default connectToMongo