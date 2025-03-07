import express from 'express';
import List from '../models/list.js';
import getUserDocument from '../models/user.js';
import { body, validationResult } from 'express-validator'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchuser from '../Middleware/fetchuser.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

// Delete account - sign out the user(remove cookies)
router.post('/delete', fetchuser, async function (req, res) {

    const { id } = req.user;

    try {
        if (id) {
            const { username } = await List.findById(id).select("-password");

            await mongoose.connection.db.dropCollection(username);
            await List.deleteOne({ username: username });

            console.log(username + ' user deleted Successfully');

            return res.status(200).json({ success: true });
        }

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }

});


router.get('/search', fetchuser, async function (req, res) {
    const receiverUsername = req.body.search;
    
    const receiverData = await List.find({
        username: { $regex: receiverUsername, $options: "i" }
    }).select("-salt -hash").exec();

    if (receiverData === null) {
        console.log("Receiver does not exist");
        return res.status(200).json({ success: true, message: "No users" });
    }
    else {
        return res.status(200).json({ success: true, receiverData });
    }
});

// Messages Page
router.get('/messages', fetchuser, async function (req, res) {
    const {user, receiver} = req.query;

    try{

        const userCollectionName = await getUserDocument(user.username);
        const receiverCollectionName = await getUserDocument(receiver.username);
        
        let userMsg = await userCollectionName.find({ receiver_id: receiver._id });
        let receiverMsg = await receiverCollectionName.find({ receiver_id: user._id });
    
        if (!receiverMsg.length) {
            receiverMsg = new userCollectionName({
                receiver_id: receiverData._id,
                chat: [],
            });
            await receiverMsg.save();
        }
    
        if (!userMsg.length) {
            userMsg = new receiverCollectionName({
                receiver_id: userData._id,
                chat: [],
            });
            await userMsg.save();
        }
    
        return res.status(200).json({ success: true, userData: userMsg[0], receiverData: receiverMsg[0] });
    }
    catch(err){
        res.status(500).json({ success: false, message:"Internal server error", error: err.message });
    }


});


router.post('/messages', fetchuser, async function (req, res) {
    const { user, receiver, message } = req.body;

    try{

        const userCollectionName = await getUserDocument(user.username);
        const userMsg = await userCollectionName.findOne({ receiver_id: receiver._id });
    
        // console.log(typeof (new Date().getTime()));
        // if (user.chat.length && user.chat[user.chat.length - 1].date === new Date().toJSON().slice(0, 10)) {
        //     user.chat[user.chat.length - 1].message.push({
        //         timeMsg: new Date().getTime(),
        //         text: message
        //     });
        // }
        // else {
        //     if (!user.chat) {
        //         user.chat = [];
        //     }
        //     user.chat.push({
        //         date: new Date().toJSON().slice(0, 10),
        //         message: [{
        //             timeMsg: new Date().getTime(),
        //             text: message
        //         }]
        //     });
        // }
    
        const todayDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const timeMsg = new Date().getTime();
        const dateIndex = userMsg.chat.findIndex(item => item.date === todayDate);
    
        if (dateIndex !== -1) {
            // If the date exists, push a new message into the message array
            userMsg.chat[dateIndex].message.push({ timeMsg, text: message });
        } else {
            // If the date does not exist, create a new date entry with the message
            userMsg.chat.push({
                date: todayDate,
                message: [{ timeMsg, text: message }]
            });
        }
        await userMsg.save();
        
        return res.status(200).json({ success: true });
    }
    catch(err){
        res.status(500).json({ success: false, message:"Internal server error", error: err.message });
    }
});

export default router;