const express = require('express');
const user = require('../controller/user.controller');
const admin = require('../controller/admin.controller');
const product = require('../controller/product.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

//routing for user sign up/sign in
router.post('/user/sign-up', user.signUp);
router.post('/user/sign-in', user.signIn);

//stripe
router.post('/create-checkout-session/:id', user.stripeSession);

//routing for admin sign in/sign up
router.post('/admin/sign-up', admin.signUp);
router.post('/admin/sign-in', admin.signIn);

// products routing
router.get('/product-id/:id', product.product);
router.post('/product/create', auth.check,product.create);
router.delete('/product/delete/:id', auth.check,product.delete);
router.put('/product/update/:id', auth.check,product.update);
router.get('/product/todaydeal', product.todaysDeal);
router.get('/product', auth.checkUser,product.allProducts);

// cart and orders routing
router.patch('/user/add-cart/:id', auth.checkUser, user.addToCart);
router.patch('/user/remove-cart/:id', auth.checkUser, user.removeCart);
router.patch('/user/order/:id', auth.checkUser, user.addToOrders);
router.patch('/user/order-delete/:id', auth.checkUser, user.removeOrder);
router.get('/user/cart', auth.checkUser, user.cart);
router.get('/user/order', auth.checkUser, user.order);

module.exports = router;