// look for availability of all the products before posting an order
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../models/order');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const geocoding = require('../middleware/geocoding');

const Food = require('../models/food');
const Sheesha = require('../models/sheesha');
const Alcohol = require('../models/alcohol');
const Place = require('../models/places');
const User = require('../models/user');

router.get('/', (req, res, next) => {
});

router.post('/', geocoding, checkAuth,  (req, res, next) => {
  data = JSON.parse(req.body);
  var bookingDate = data.booking_date;

  console.log(data.booking_date);
  var date = new Date(bookingDate);
  var token = req.headers.authorization.split(" ")[1];
  const cart_data = jwt.decode(token);

  const order = new Order ({
    _id: mongoose.Types.ObjectId(),
    user: data.user,

    cart: cart_data,
    decoration: data.decoration,
    liquor: data.liquor,
    catering: data.catering,
    location: data.location,
    string_address: req.formatted_address,

    booking_date: date,
    order_status: data.order_status,

    payment_id: data.payment_id,
    
  });
  order
  .save()
  .then(result => {
    console.log(result);
    res.status(201).json({
        message: "Order Posted Sucessfully"
    });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

router.get('/user/:userId', (req, res, next) => {
  const ID = req.params.userId;
  console.log(ID)
  var query = {user: ID}
  Order.find(query)
  .exec()
  .then(docs => {
    const response = {
        count: docs.length,
        orders: docs
    }
    res.status(200).json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
  });
});

router.delete('/:orderId', (req, res, next) => { 

});

module.exports = router;