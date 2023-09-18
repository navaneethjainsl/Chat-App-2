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

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/login.html');
});

// Login only if user account is present
app.post('/login', async (req, res) =>{
    // const name = req.body.name;
    const username = req.body.username;

    const userdata = await List.findOne({ username: username}).exec();
    console.log(userdata);
    
    // Check if user has an account
    if(userdata === null){
        console.log('User Name not found');
        res.redirect('/');
    }
    else{
        console.log('Login Successfull');   //remove
        res.render('index', {name: userdata.name, username: userdata.username})
    }
});

// Signup to create a new user account
app.post('/signup', async function(req, res){
    const name = req.body.name;
    const username = req.body.username;

    // Check if an account with the given username already exists
    const userdata = await List.findOne({ username: username}).exec();
    
    if(userdata != null){
        console.log(userdata);
        console.log('Sign Up Unsuccessfull');
        return res.redirect('/');
    }

    // Add the user to the List of all users
    const list = new List({
        name: name,
        username: username
    });
    await list.save();

    // Create a collection for each user
    // Name each collection with the given username
    const userSchema = new mongoose.Schema({
        reciever_id: mongoose.Schema.Types.ObjectId,
        chat: {
            date: Date,
            message: {
                timeMsg: Date,
                text: String
            }
        }
    });
    
    mongoose.model(username , userSchema, username);
    
    console.log('Sign Up Successfull');
    res.redirect('/');
    
})

app.listen(port, ()=>{
    console.log('listening on port' + port);
})