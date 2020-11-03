//Implent User using jwt tokens to save cart for period od time 

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

var Place = require('../models/places');
var Sheesha = require('../models/sheesha');
var Food = require('../models/food');
var Alcohol = require('../models/alcohol');
var Cart = require('../models/cart');

var cart = new Cart({});

router.get('/add-place-to-cart/:placeId', checkAuth, (req, res, next) => {
    const Id = req.params.placeId;
    var price = req.query.price;
    var token = req.headers.authorization.split(" ")[1]; 

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
        console.log(cart);
    });
});

router.get('/delete-place-from-cart/:placeId', checkAuth, (req, res, next) => {
    const Id = req.params.placeId;
    var token = req.headers.authorization.split(" ")[1]; 

    Place.findById(Id, function(err, place) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.delete(token, place, place._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });
});

router.get('/add-food-to-cart/:foodId', checkAuth, (req, res, next) => {
    const Id = req.params.foodId;    
    var token = req.headers.authorization.split(" ")[1];

    Food.findById(Id, function(err, food) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.add(token, food, food._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });
});

router.get('/delete-food-from-cart/:foodId', checkAuth, (req, res, next) => {
    const Id = req.params.foodId;    
    var token = req.headers.authorization.split(" ")[1];

    Food.findById(Id, function(err, food) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.delete(token, food, food._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });
});

router.get('/add-alcohol-to-cart/:alcoholId', checkAuth, (req, res, next) => {
    const Id = req.params.alcoholId;
    var token = req.headers.authorization.split(" ")[1];

    Alcohol.findById(Id, function(err, alcohol) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.add(token, alcohol, alcohol._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });
});

router.get('/delete-alcohol-from-cart/:alcoholId', checkAuth, (req, res, next) => {
    const Id = req.params.alcoholId;
    var token = req.headers.authorization.split(" ")[1];

    Alcohol.findById(Id, function(err, alcohol) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.delete(token, alcohol, alcohol._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });
});


router.get('/add-sheesha-to-cart/:sheeshaId', checkAuth, (req, res, next) => {
    const Id = req.params.sheeshaId;
    var token = req.headers.authorization.split(" ")[1];

    Sheesha.findById(Id, function(err, sheesha) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.add(token, sheesha, sheesha._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });

});

router.get('/delete-sheesha-from-cart/:sheeshaId', checkAuth, (req, res, next) => {
    const Id = req.params.sheeshaId;
    var token = req.headers.authorization.split(" ")[1];

    Sheesha.findById(Id, function(err, sheesha) {
        if(err) {
        console.log(err);
        res.status(500).json({error: err});
        }
        token = cart.delete(token, sheesha, sheesha._id);
        res.status(200).json({
            cart: token
        });
        console.log(cart);
    });

});


module.exports = router;