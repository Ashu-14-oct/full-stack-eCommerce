const Product = require("../models/product.model");

//creating product endpoint
module.exports.create = async (req, res) => {
    try{
        const {name, description, quantity, price, photo, isDealOfTheDay} = req.body;
        const product = await Product.create({
            name,
            description,
            quantity,
            price,
            photo,
            isDealOfTheDay
        });

        return res.status(201).json({message: "New product added", product});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//deleting product endpoint
module.exports.delete = async (req, res) => {
    try{
        const {id} = req.params
        const product = await Product.findOne({_id: id});

        if(!product){
            return res.status(409).json({message: "Product does not exist"});
        }

        const deleteProduct = await Product.findOneAndDelete({_id: id});
        return res.status(200).json({message: "Product deleted successfully", deleteProduct});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//updatin product endpoint
module.exports.update = async (req, res) => {
    try{
        const {id} = req.params
        const {name, description, quantity, price, isDealOfTheDay} = req.body;
        const product = await Product.findOne({_id: id});
        if(!product){
            return res.status(409).json({message: "Product does not exist"});
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            quantity,
            price,
            isDealOfTheDay
        }, {new: true});

        return res.status(200).json({message: "Product updated successfully", updatedProduct});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//get all products endpoint
module.exports.allProducts = async (req, res) => {
    try{
        const allProducts = await Product.find();
        return res.status(200).json({allProducts});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

// get specific product using id
module.exports.product = async (req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById({_id: id});
        if(!product){
            return res.status(404).json({message: "Product does not exist"});
        }
        return res.status(200).json({product});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//get today's deal
module.exports.todaysDeal = async (req, res) => {
    try{
        const products = await Product.find({isDealOfTheDay: true});
        return res.status(200).json({products});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

