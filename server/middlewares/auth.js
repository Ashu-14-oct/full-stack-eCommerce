const jwt = require("jsonwebtoken");
const User = require('../models/user.model');

module.exports.check = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(409).json({message: "Missing token"});
        }
        const auth = token.replace("Bearer ", "");
        const decoded = await jwt.verify(auth, process.env.KEY)
        const user = await User.findOne({_id: decoded._id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        if(user.role !=='admin'){
            return res.status(404).json({message: "Unauthorized request"});
        }
        next();
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//checking for user
module.exports.checkUser = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(409).json({message: "Missing token"});
        }
        const auth = token.replace("Bearer ", "");
        const decoded = await jwt.verify(auth, process.env.KEY)
        const user = await User.findOne({_id: decoded._id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        // console.log(req.user);
        if(user.role !=='user'){
            return res.status(404).json({message: "Unauthorized request"});
        }
        next();
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}