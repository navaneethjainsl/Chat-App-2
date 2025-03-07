import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const listSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
    },
    password: String,
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     unique: true,
    //     dropDups: true,
    //     required: true,
    // },
    // collection: type: mongoose.SchemaTypes.ObjectId
    // collection: userSchema
});

async function getListDocument(username){
    const Document = await mongoose.model(username, listSchema, username);
    // Document.createIndexes();
    return Document
}

// export default getListDocument;

const List = mongoose.model("List", listSchema);
List.createIndexes();

export default List;