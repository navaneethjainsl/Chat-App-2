const express = require ('express');
const mongodb = require('mongodb');
const mongoose  = require('mongoose');
const ejs = require('ejs');
const lodash = require('lodash');
const bodyParser = require('body-parser');
var util = require('util');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const port = process.env.PORT || 3000;

const app = express();
// const ObjectId = mongoose.Types.ObjectId;
// console.log("ObjectId");
// console.log(ObjectId);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "navaneethjainsl",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// const db = mongoose.createConnection('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
const db = mongoose.connect('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

// // Use to access all collections in mongodb.Db
// // use it to access any users collection
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
        date: {
            type: String,
        },
        message: [{
            timeMsg: Number,
            text: String
        }]
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

listSchema.plugin(passportLocalMongoose);

const List = mongoose.model('List', listSchema);

passport.use(List.createStrategy());
passport.serializeUser(List.serializeUser());
passport.deserializeUser(List.deserializeUser());


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/login.html');
});


// Signup to create a new user account
app.post('/signup', async function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    
    List.register({username: username}, password, async function(err, list) {
        if (err) { 
            console.log("Error in /signup");
            console.log(err);
            res.redirect('/');
        }
        else{
            console.log('Sign Up Successfull');
            
            // console.log(list);
            list.name = name;
            await list.save();
            
            const User = mongoose.model(username , userSchema, username);
            
            passport.authenticate("local")(req, res, function(){
                // res.redirect(`/search/${userData._id}`);
                res.redirect(`/`);
            })
        }
      
    });
    
    // // Check if an account with the given username already exists
    // const userData = await List.findOne({ username: username}).exec();
    
    // if(userData != null){
    //     console.log(userData);
    //     console.log('Sign Up Unsuccessfull');
    //     return res.redirect('/');
    // }

    // // Add the user to the List of all users
    // const list = new List({
    //     name: name,
    //     username: username,
    //     // userId: User._id,
    //     // collection: user
    // });
    // await list.save();    
    
});

// Login only if user account is present
app.post('/login', async (req, res) =>{
    const list = new List({
        username: req.body.username,
        password: req.body.password
    });

    req.login(list, async function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            const username = req.body.username;
            const userData = await List.findOne({ username: username}).exec();

            passport.authenticate("local")(req, res, function(){
                console.log('Login Successfull');   //remove
                res.redirect(`/search/${userData._id}`);
            });
        }
    })
    
    
    // // Check if user has an account
    // if(userData === null){
    //     console.log('User Name not found');
    //     res.redirect('/');
    // }
    // else{
    //     console.log('Login Successfull');   //remove
    //     res.redirect('/search/' + userData._id);
    // }
});

//Logout
app.post('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

// Delete a User
app.get('/delete/:Collection', async function(req, res) {
    if(req.isAuthenticated()){

        const collection = req.params.Collection;
        
        await mongoose.connection.db.dropCollection(collection);
        
        await List.deleteOne({username: collection});
    
        console.log(collection + 'Delete Successfull');
        // res.redirect('/');
    }

    res.redirect('/');
    
});

// Search Other Users
app.get('/search/:objid', async function(req, res){
    if(req.isAuthenticated()){
        const objid = req.params.objid;
    
        const userData = await List.findOne({ _id: objid}).exec();
        console.log(userData);
        res.render('index', {data: userData});
    }
    else{
        res.redirect('/');
    }
    
});

app.post('/search/:objid', async function(req, res){
    if(req.isAuthenticated()){
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
        
    }
    else{
        res.redirect('/');
    }
    
});

// Messages Page
app.get('/messages/:userId/:receiverId', async function(req, res){
    if(req.isAuthenticated()){
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
        
        let user = await userCollectionName.find({receiver_id: receiverData._id});
        let receiver = await receiverCollectionName.find({receiver_id: userData._id});
        console.log("user");
        console.log(JSON.stringify(user));
        console.log("receiver");
        console.log(JSON.stringify(receiver));
    
        res.render('message', {userData: user[0], receiverData: receiver[0], userId: userId, receiverId: receiverId});
        
    }
    else{
        res.redirect('/');
    }
    
    
});


app.post('/messages/:userId/:receiverId/send', async function(req, res){
    if(req.isAuthenticated()){
        console.log('Inside /messages/:userId/:receiverId/send');
        
        const receiverId = req.params.receiverId;
        const userId = req.params.userId;
        console.log(userId);
        const receiverData = await List.findOne({ _id: receiverId});
        const userData = await List.findOne({ _id: userId});
        console.log(userData);
        
        const userCollectionName = await mongoose.model(userData.username, userSchema, userData.username);
        // const receiverCollectionName = await  mongoose.model(receiverData.username, userSchema, receiverData.username);
        
        // let receiver = await userCollectionName.find({receiver_id: receiverData._id});
        
        console.log("receiverData._id");
        console.log(receiverData._id);
        let user = await userCollectionName.findOne({receiver_id: receiverData._id});
    
        console.log("user.chat");
        console.log(user.chat);
        console.log(typeof(new Date().getTime()));
    
        if(user.chat.length && user.chat[user.chat.length - 1].date === new Date().toJSON().slice(0, 10)){
            user.chat[user.chat.length - 1].message.push({
                timeMsg: new Date().getTime(),
                text: req.body.message
            });
        }
        else{
            if(!user.chat){
                user.chat = [];
            }
            user.chat.push({
                date: new Date().toJSON().slice(0, 10),
                message: [{
                    timeMsg: new Date().getTime(),
                    text: req.body.message 
                }]
            });
        }
        
        await user.save();
        // const update = await userCollectionName.findOneAndUpdate({receiver_id: userData._id}, { chat: user.chat });
        // console.log(update);
    
        res.redirect(`/messages/${userId}/${receiverId}`);
        
    }
    else{
        res.redirect('/');
    }
    
    
});


app.listen(port, ()=>{
    console.log('listening on port' + port);
})