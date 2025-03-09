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

router.post('/delete/:username', fetchuser, async function (req, res) {

    const { username } = req.params;

    try {
        if (username) {

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

router.get("/contacts", fetchuser, async function (req, res) {
    const { id } = req.user;

    try {
        const user = await List.findById(id);

        const userCollectionName = await getUserDocument(user.username);
        const userContacts = await userCollectionName.find();
        const otherContacts = await List.find();

        // otherContacts = otherContacts.map(({ password, _id, ...receiver }) => ({
        //     ...receiver._doc,
        //     id: _id,
        //     lastContacted: new Date()
        // }));

        // console.log(userContacts.map(contact => contact))

        let allContacts = otherContacts
            .filter(contact => contact.username !== user.username)
            .map(contact => {
                const userContact = userContacts.find(uc => String(uc.receiver_id) == String(contact._id));
                console.log(userContact)
                return {
                    username: contact.username,
                    name: contact.name,
                    _id: userContact ? userContact._id : contact._id, // Use userContact._id if it exists, otherwise fallback
                    email: contact.email,
                    phnum: contact.phnum,
                    receiver_id: userContact ? userContact.receiver_id : contact._id,
                    favorite: userContact ? userContact.favorite || false : false,
                    avatarColor: "bg-blue-100",
                    chat: userContact ? userContact.chat : [],
                    lastContacted: userContact ? userContact.chat.length ? userContact.chat[userContact.chat.length-1].timeMsg : 0 : 0
                };
            });
            // console.log("new Date(0)");
            // console.log(new Date(0));

        // allContacts = allContacts.filter(contact => contact.username !== user.username);
        // console.log(allContacts);

        return res.status(200).json({ success: true, allContacts, user });
        // const collections = await mongoose.connection.db.listCollections().toArray();
        // console.log("Collections:", collections);

    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
})

router.post("/favorite", fetchuser, async function (req, res) {
    const { id } = req.user;

    try {
        const { receiver_id, favorite } = req.body;
        console.log({ receiver_id, favorite });
        const user = await List.findById(id).lean();

        console.log(user);
        const userCollectionName = await getUserDocument(user.username);
        await userCollectionName.updateOne(
            { receiver_id: receiver_id },
            { $set: { favorite: favorite } }
        );

        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
})

// Messages Page
router.get('/messages', fetchuser, async function (req, res) {
    const { user, receiver } = req.query;
    console.log("receiver");
    console.log(receiver);

    try {

        const userCollectionName = await getUserDocument(user.username);
        const receiverCollectionName = await getUserDocument(receiver.username);

        let userMsg = await userCollectionName.find({ receiver_id: receiver._id });
        let receiverMsg = await receiverCollectionName.find({ receiver_id: user._id });

        console.log("userMsg");
        console.log(userMsg);
        console.log("receiverMsg");
        console.log(receiverMsg);

        if (!receiverMsg.length) {
            receiverMsg = new userCollectionName({
                receiver_id: receiver._id,
                chat: [],
            });
            await receiverMsg.save();
        }

        if (!userMsg.length) {
            userMsg = new receiverCollectionName({
                receiver_id: user._id,
                chat: [],
            });
            await userMsg.save();
        }

        return res.status(200).json({ success: true, userData: userMsg[0], receiverData: receiverMsg[0] });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }


});


router.post('/messages', fetchuser, async function (req, res) {
    const { user, receiver, message } = req.body;

    try {

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

        // const todayDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
        // const timeMsg = new Date().getTime();
        // const dateIndex = userMsg.chat.findIndex(item => item.date === todayDate);

        // if (dateIndex !== -1) {
        //     // If the date exists, push a new message into the message array
        //     userMsg.chat[dateIndex].message.push({ timeMsg, text: message });
        // } else {
        //     // If the date does not exist, create a new date entry with the message
        //     userMsg.chat.push({
        //         date: todayDate,
        //         message: [{ timeMsg, text: message }]
        //     });
        // }
        // await userMsg.save();

        const timeMsg = new Date().getTime();
        userMsg.chat.push({
            timeMsg, text: message
        });
        await userMsg.save()

        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

export default router;