import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

const fetchuser = (req, res, next) =>{
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).json({ message: 'Please authenticate using a valid token' });
    }

    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch(err){
        res.status(500).json({ success: false, error: err.message });
    }

}

export default fetchuser;