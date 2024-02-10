const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    isDealOfTheDay: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;