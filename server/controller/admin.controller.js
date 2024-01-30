const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// sign up for admin
module.exports.signUp = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const user = await User.findOne({email: email});
        // checking if user already exist in database
        if(user){
            return res.status(409).json({message: "User already exist, try different mail"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const userData = {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }

        return res.status(201).json({message: "Account created successfully", userData});

    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

// sign in for admin
module.exports.signIn = async (req, res) => {
    try{
        const {email , password} = req.body;
        const user = await User.findOne({email: email});
        //checking if user doesnt exist
        if(!user){
            return res.status(404).json({message: "User does not exist"});
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(401).json({message: "Incorrect password"});
        }

        const token = jwt.sign({_id: user._id}, process.env.KEY);

        return res.status(200).json({message: "Signed in succesfully", token, user:{email}});
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}