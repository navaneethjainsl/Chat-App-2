const express = require ('express');
const mongodb = require('mongodb');
const mongoose  = require('mongoose');
const ejs = require('ejs');
const lodash = require('lodash');
const bodyParser = require('body-parser');
// const { Schema } = mongoose;

const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

// Use to access all collections in mongodb.Db
// use it to access any users collection
// mongoose.connection.once('open', async () => {
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     console.log(collections);
//     mongoose.connection.close();
// });

// List collection stores the list of all users having their account on chat app
const listSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
    }
});

// Create a collection for each user
    // Name each collection with the given username
    const userSchema = new mongoose.Schema({
        reciever_id: mongoose.Schema.Types.ObjectId,
        chat: [{
            date: Date,
            message: {
                timeMsg: Date,
                text: String
            }
        }]
    });
    

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/login.html');
});

// Login only if user account is present
app.post('/login', async (req, res) =>{
    // const name = req.body.name;
    const username = req.body.username;

    console.log("/login hi1");
    const userData = await List.findOne({ username: username}).exec();
    console.log("/login hi1");
    console.log(userData);
    
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

    // Add the user to the List of all users
    const list = new List({
        name: name,
        username: username
    });
    await list.save();
    
    
    mongoose.model(username , userSchema, username);
    
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
    res.render('index', {name: userData.name, username: userData.username, userid: userData._id});
});

app.post('/search/:objid', async function(req, res){
    const search = req.body.search;
    const objid = req.body.objid;
    const recieverData = await List.findOne({ username: search}).exec();
    const userData = await List.findOne({ _id: objid}).exec();
    const userCollectionData = "hi";
    const collections = [];

    mongoose.connection.once('open', async () => {
        console.log("hi1");
        const collections = await mongoose.connection.db.listCollections().toArray();
        // console.log(collections);
        collections.forEach((collection) => {
            console.log(collection.name);
        });
        mongoose.connection.close();
    });
    
    // collections.forEach((collection)=>{
    //     console.log("hi2");
    //     if(collection === userData.username){
    //         const userCollectionData = collection;
    //         console.log(userCollectionData);
    //     }
    // });
    // console.log(userCollectionData);
    
    // userCollectionData = await MyModel.find({});
    // console.log(userCollectionData);
    
    // recieverData = await userCollectionData.findOne({ reciever_id: recieverData._id}).exec();
    // if(!recieverData){
    //     const recieverChat = new userCollectionData({
    //         reciever_id: recieverData._id,
    //         chat: []
    //     });
    //     await recieverChat.save();
    // }
    // res.redirect("/messages/" + userData._id + "/" + recieverData._id);

});

app.listen(port, ()=>{
    console.log('listening on port' + port);
})