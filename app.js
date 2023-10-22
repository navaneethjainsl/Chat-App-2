const express = require ('express');
const mongodb = require('mongodb');
const mongoose  = require('mongoose');
const ejs = require('ejs');
const lodash = require('lodash');
const bodyParser = require('body-parser');
var util = require('util');
// const { Schema } = mongoose;

const port = process.env.PORT || 3000;

const app = express();
const ObjectId = mongoose.Types.ObjectId;
// console.log("ObjectId");
// console.log(ObjectId);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const db = mongoose.createConnection('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
const db = mongoose.connect('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
// console.log("db");
// console.log(db);

// Use to access all collections in mongodb.Db
// use it to access any users collection
// mongoose.connection.once('open', async () => {
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     console.log(collections);
//     mongoose.connection.close();
// });

// Create a collection for each user
// Name each collection with the given username
const userSchema = new mongoose.Schema({
    receiver_id: mongoose.Schema.Types.ObjectId,
    chat: [{
        date: Date,
        message: {
            timeMsg: Date,
            text: String
        }
    }]
});

// List collection stores the list of all users having their account on chat app
const listSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
    },
    // collection: type: mongoose.SchemaTypes.ObjectId
    // collection: userSchema
});

const List = mongoose.model('List', listSchema);


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/login.html');
});

// Login only if user account is present
app.post('/login', async (req, res) =>{
    const username = req.body.username;

    const userData = await List.findOne({ username: username}).exec();
    
    // Check if user has an account
    if(userData === null){
        console.log('User Name not found');
        res.redirect('/');
    }
    else{
        console.log('Login Successfull');   //remove
        res.redirect('/search/' + userData._id);
    }
});

// Signup to create a new user account
app.post('/signup', async function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    
    // Check if an account with the given username already exists
    const userData = await List.findOne({ username: username}).exec();
    
    if(userData != null){
        console.log(userData);
        console.log('Sign Up Unsuccessfull');
        return res.redirect('/');
    }
    
    const User = mongoose.model(username , userSchema, username);

    // Add the user to the List of all users
    const list = new List({
        name: name,
        username: username,
        // collection: user
    });
    await list.save();    
    
    console.log('Sign Up Successfull');
    res.redirect('/');
    
});

app.get('/delete/:Collection', async function(req, res) {
    const collection = req.params.Collection;
    
    mongoose.connection.db.dropCollection(collection);
    
    await List.deleteOne({username: collection});

    console.log(collection + 'Delete Successfull');
    res.redirect('/');
});

app.get('/search/:objid', async function(req, res){
    const objid = req.params.objid;

    const userData = await List.findOne({ _id: objid}).exec();
    console.log(userData);
    res.render('index', {data: userData});
});

app.post('/search/:objid', async function(req, res){
    const receiverUsername = req.body.search;
    const userId = req.params.objid;
    const receiverData = await List.findOne({ username: receiverUsername}).exec();
    const userData = await List.findOne({ _id: userId});
    console.log("userData");
    console.log(userData);
    console.log("receiverData");
    console.log(receiverData);
    
    const userCollectionName = await  mongoose.model(userData.username, userSchema, userData.username);
    const receiverCollectionName = await  mongoose.model(receiverData.username, userSchema, receiverData.username);
    // const userCollection = await userCollectionName.find({});
    // console.log("userCollection");
    // console.log(userCollection);
    // console.log(userCollection.length);

    let receiver;
    let user;
    // if(userCollection.length){
    //     receiver = await userCollectionName.find({receiver_id: receiverData._id});
    //     console.log("receiver");
    //     console.log(receiver);
    // }

    receiver = await userCollectionName.find({receiver_id: receiverData._id});
    user = await receiverCollectionName.find({receiver_id: userData._id});
    console.log("receiver");
    console.log(receiver);
    console.log("user");
    console.log(user);
    
    if(!receiver.length){
        receiver = new userCollectionName({
            receiver_id: receiverData._id,
            chat: [],
            // collection: user
        });
        await receiver.save();
    }

    if(!user.length){
        user = new receiverCollectionName({
            receiver_id: userData._id,
            chat: [],
            // collection: user
        });
        await user.save();
    }
    
    // console.log(receiverData._id)
    res.redirect("/messages/" + userData._id + "/" + receiverData._id);

});

app.get('/messages/:userId/:receiverId', async function(req, res){
    console.log("Entered get /messages");
    
    const receiverId = req.params.receiverId;
    const userId = req.params.userId;
    const receiverData = await List.findOne({ _id: receiverId});
    const userData = await List.findOne({ _id: userId});
    console.log("userData");
    console.log(userData);
    console.log("receiverData");
    console.log(receiverData);
    
    const userCollectionName = await  mongoose.model(userData.username, userSchema, userData.username);
    const receiverCollectionName = await  mongoose.model(receiverData.username, userSchema, receiverData.username);
    
    let receiver = await userCollectionName.find({receiver_id: receiverData._id});
    let user = await receiverCollectionName.find({receiver_id: userData._id});
    console.log("user");
    console.log(user);
    console.log("receiver");
    console.log(receiver);
});

app.listen(port, ()=>{
    console.log('listening on port' + port);
})