//Implent User using jwt tokens to save cart for period od time 

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
var jwt_decode = require('jwt-decode');

var Place = require('../models/places');
var Package = require('../models/packages');
var Sheesha = require('../models/sheesha');
var Food = require('../models/food');
var Alcohol = require('../models/alcohol');

var Cart = require('../models/cart');
var PackageIntegration = require('../middleware/package-integration');


router.get('/add-place-to-cart/:placeId', checkAuth, (req, res, next) => {
    const Id = req.params.placeId;
    var price = req.query.price;
    var token = req.headers.authorization.split(" ")[1]; 
    var cart = new Cart({});

    Place.findById(Id, function(err, place) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        place.price = parseInt(price);
        token = cart.add(token, place, place._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/delete-place-from-cart/:placeId', checkAuth, (req, res, next) => {
    const Id = req.params.placeId;
    var token = req.headers.authorization.split(" ")[1]; 
    var cart = new Cart({});

    Place.findById(Id, function(err, place) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.delete(token, place, place._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/add-food-to-cart/:foodId', checkAuth, (req, res, next) => {
    const Id = req.params.foodId;    
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Food.findById(Id, function(err, food) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.add(token, food, food._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/delete-food-from-cart/:foodId', checkAuth, (req, res, next) => {
    const Id = req.params.foodId;    
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Food.findById(Id, function(err, food) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.delete(token, food, food._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/add-alcohol-to-cart/:alcoholId', checkAuth, (req, res, next) => {
    const Id = req.params.alcoholId;
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Alcohol.findById(Id, function(err, alcohol) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.add(token, alcohol, alcohol._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/delete-alcohol-from-cart/:alcoholId', checkAuth, (req, res, next) => {
    const Id = req.params.alcoholId;
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Alcohol.findById(Id, function(err, alcohol) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.delete(token, alcohol, alcohol._id);
        res.status(200).json({
            cart: token
        });
    });
});


router.get('/add-sheesha-to-cart/:sheeshaId', checkAuth, (req, res, next) => {
    const Id = req.params.sheeshaId;
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Sheesha.findById(Id, function(err, sheesha) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.add(token, sheesha, sheesha._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/delete-sheesha-from-cart/:sheeshaId', checkAuth, (req, res, next) => {
    const Id = req.params.sheeshaId;
    var token = req.headers.authorization.split(" ")[1];
    var cart = new Cart({});

    Sheesha.findById(Id, function(err, sheesha) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        }
        token = cart.delete(token, sheesha, sheesha._id);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/add-package-to-cart/:packageId', (req, res, next) => {
    const Id = req.params.packageId;
    var token = req.headers.authorization.split(" ")[1];
    var packageIntegrator = new PackageIntegration({});

    Package.findById(Id, function(err, package) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        } 
        token = packageIntegrator.add(token, package);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/delete-package-from-cart/:packageId', (req, res, next) => {
    const Id = req.params.packageId;
    var token = req.headers.authorization.split(" ")[1];
    var packageIntegrator = new PackageIntegration({});

    Package.findById(Id, function(err, package) {
        if(err) {
            console.log(err);
            res.status(500).json({error: err});
        } 
        token = packageIntegrator.remove(token);
        res.status(200).json({
            cart: token
        });
    });
});

router.get('/clear-cart', (req, res, next) => {
    var token = req.headers.authorization.split(" ")[1];
    var cart = jwt_decode(token, process.env.JWT_KEY);
    token = jwt.sign({
        user : {
            name: cart.user.name,
            email: cart.user.email,
            id: cart.user.id
            },
        items : "items",
        total_price: 0,
        total_Qty : 0
        },
        process.env.JWT_KEY,
        {    
            expiresIn: "24h"
        }
    );
    res.status(200).json({
        cart: token
    });
});


module.exports = router;