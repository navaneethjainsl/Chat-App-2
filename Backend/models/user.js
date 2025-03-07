import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    receiver_id: mongoose.Schema.Types.ObjectId,
    chat: [{
        date: {
            type: String,
        },
        message: [{
            timeMsg: Number,
            text: String
        }]
    }]
});

async function getUserDocument(username){
    const Document = await mongoose.model(username, userSchema, username);
    // Document.createIndexes();
    return Document
}

export default getUserDocument;