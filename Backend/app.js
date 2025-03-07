import express from  'express';
import fileUpload from 'express-fileupload';
import session from 'express-session';

import passport from 'passport';
// import passportLocalMongoose from 'passport-local-mongoose';
import { Strategy } from 'passport-local';
import cookieParser from 'cookie-parser';

// import mongodb from 'mongodb';
// import mongoose from 'mongoose';
import connectToMongo from "./db.js"
connectToMongo();
import List from './models/list.js';
import getUserDocument from './models/user.js';

// import ejs from 'ejs';
// import lodash from 'lodash';
import dotenv from 'dotenv/config';
import bodyParser from 'body-parser';
import axios from "axios";
import cors from "cors";

// import path from 'path';
import process from 'process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());

app.use(session({
    secret: "navaneethjainsl",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
	origin: 'http://localhost:8080', // allow to server to accept request from different origin
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true // allow session cookie from browser to pass through
}));

app.use((req, res, next) => {
	// access-control-allow-origin http://localhost:5173
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// const db = mongoose.connect('mongodb+srv://navaneethjainsl:chatapp2@cluster0.mzm2lqz.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

// // Use to access all collections in mongodb.Db
// // use it to access any users collection
// mongoose.connection.once('open', async () => {
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     console.log(collections);
//     mongoose.connection.close();
// });

app.use((req, res, next) => {
	console.log(`Received ${req.method} request for '${req.url}' - Body: ${JSON.stringify(req.body)}`);
	next();
});

app.get('/', (req, res) =>{
    res.redirect('login')
});

import auth from "./routes/auth.js";
import user from "./routes/user.js";
app.use('/api/auth', auth);
app.use('/api/user', user);

app.listen(port, ()=>{
    console.log('listening on port' + port);
})