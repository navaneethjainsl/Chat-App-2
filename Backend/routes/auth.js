import express from 'express';
import List from '../models/list.js';
import getUserDocument from '../models/user.js';
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchuser from '../Middleware/fetchuser.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

// Signup to create a new user account
router.post('/signup',
    [
        body('name', "Name should have atleast 2 letters").isLength({ min: 2 }),
        body('username', "Username should have atleast 5 characters").isLength({ min: 5 }),
        body('password', "Password should have atleast 5 characters").isLength({ min: 5 }),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation Error", errors: errors.array() });
        }

        
        try {
            const {name, username, password } = req.body;

            let user = await List.findOne({ username: `${username}` });
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a user document in users collection
            user = await List.create({
                name: name,
                username: username,
                password: hashedPassword,
            });

            // Create a user's own collection
            await getUserDocument(username)

            // Create a jwt token
            const data = {
                user: {
                    id: user._id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)

            return res.status(200).json({ success: true, authtoken });
        }
        catch (err) {
            res.status(500).json({ success: false, message:"Internal server error", error: err.message });
        }   

    });

// Login only if user account is present
router.post('/login',
    [
        body('username', "Username should have atleast 5 characters").isLength({ min: 5 }),
        body('password', "Password should have atleast 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation Error", errors: errors.array() });
        }
        
        try {
            const { username, password } = req.body;
            
            const user = await List.findOne({ username: `${username}` });
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not registered' });
            }
            
            const pwdCompare = await bcrypt.compare(password, user.password);
            if (!pwdCompare) {
                return res.status(400).json({ success: false, message: 'Login with correct credentials' });
            }

            const data = {
                user: {
                    id: user._id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)

            return res.status(200).json({ success: true, authtoken });
        }
        catch (err) {
            res.status(500).json({ success: false, message:"Internal server error", error: err.message });
        }
    });

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await List.findById(userId).select("-password");
        return res.status(200).json({ success: true, user });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
);

// //Logout
// app.post('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// })

export default router;