const User = require('../models/user.model');
const Product = require("../models/product.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE);

//create user endpoint
module.exports.signUp = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        //check if user exist already
        const user = await User.findOne({email: email});
        if(user){
            return res.status(409).json({message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        //user does not exist so we are creating new one
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const newUserData = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email 
        }
        console.log(newUserData);
        return res.status(201).json({message: "User signed up succesfully", newUserData});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//sign in user
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

//add to cart
module.exports.addToCart = async (req, res) => {
    try{
         const {id} = req.params;
         console.log(id);
         const product = await Product.findById({_id: id});
         if(!product){
            return res.status(409).json({message: "Product does not exist"});
         }

         const user = req.user;
         user.cart.push(id);
         user.save();
         return res.status(200).json({message: "Added to the cart successfully", user});
    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

// add to order
module.exports.addToOrders = async (req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById({_id: id});
        if(!product){
           return res.status(409).json({message: "Product does not exist"});
        }

        const user = req.user;
        user.order.push(product._id);
        user.save();
        return res.status(200).json({message: "Added to the orders successfully", user});
    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

// remove from cart
module.exports.removeCart = async (req, res) => {
    try{
        const {id} = req.params;
        const user = req.user;
        user.cart = user.cart.filter((product) => product.toString() !== id.toString());
        await user.save();
        return res.status(200).json({message: "Product removed successfully", user});

    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

// remove from order
module.exports.removeOrder = async (req, res) => {
    try{
        const {id} = req.params;
        const user = req.user;
        user.order = user.order.filter((product) => product.toString() !== id.toString());
        await user.save();
        return res.status(200).json({message: "Product removed successfully", user});
    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

//get cart items
module.exports.cart = async (req, res) => {
    try{
        const user = req.user;
        const cartItems = user.cart;

        return res.status(200).json({cartItems});
    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

//get order items
module.exports.order = async (req, res) => {
    try{
        const user = req.user;
        const orderItems = user.order;

        return res.status(200).json({orderItems});
    }catch(err){
        console.log((err));
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports.stripeSession = async (req, res) => {
    try {
        // Retrieve the productId from the request
        const { id } = req.params;

        // Retrieve the product details from your database based on the productId
        const product = await Product.findById({_id: id});

        // Create a new Checkout Session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: product.name,
                            images: [product.photo],
                        },
                        unit_amount: product.price*100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/orders',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}