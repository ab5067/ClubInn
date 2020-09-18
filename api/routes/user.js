//Patch request for user to edit personal details

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const client = require('twilio')(process.env.accountSID, process.env.authToken);
const geocoding = require('../middleware/geocoding');

const User = require('../models/user');

router.post('/signup', geocoding, (req, res, next) => {
    const data = JSON.parse(req.body);
    var date = data.birthday;
    var birthday = new Date(date);

    User.find({email: data.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            res.status(409).json({
                message: 'User exists'
            });
        } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: data.name, 
                        email: data.email, 
                        password: hash, 
                        birthday: birthday,
                        gender: data.gender, 
                        location: {
                            type: data.location.type,
                            coordinates: data.location.coordinates
                        },
                        string_address: req.formatted_address,
                        phone_number: data.phone_number
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    }); 
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
    const data = JSON.parse(req.body) //add JSON.parse(req.body) when using app 
    User.find({email: data.email})
    .exec()
    .then(user => {
       if(user.length < 1) {
           res.status(401).json({
              message: 'Auth failed' 
           });
       } 
       bcrypt.compare(data.password, user[0].password, (err, result) => {
          if(err) {
              res.status(401).json({
                  message: 'Auth Failed'
              });
          }
          if(result) {
              const token = jwt.sign({
                    user : {
                        email: user[0].email,
                        id: user[0]._id
                        },
                    items : "items"
                    },
                    process.env.JWT_KEY,
                    {    
                        expiresIn: "1h"
                    }
               );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'auth Failed'
            });
       });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:userId', (req, res, next) => { 
    const ID = req.params.userId;
    console.log(ID)
    User.findById(ID)
    .exec()
    .then(docs => {
      console.log(docs)
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
    });
});

router.post('/forgot', (req, res, next) => {
    const data = JSON.parse(req.body);
    User.find({email: data.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            res.status(401).json({
               message: 'Incorrect Email Id' 
            });
        } else {
            client
            .verify
            .services(process.env.serviceID)
            .verifications
            .create({
                to: `+91${user[0].phone_number}`,
                channel: 'sms'
            })
            .then((data) => {
                res.status(200).json({
                    data: data,
                    phone_number: user[0].phone_number,
                    id: user[0]._id
                });
            })
        }
    });
});

router.post('/verify', (req, res, next) => {

    client
    .verify
    .services(process.env.serviceID)
    .verificationChecks
    .create({
        to: `+91${req.query.phonenumber}`,
        code: req.query.code
    })
    .then((data) => {
        res.status(200).json({data: data})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:userId', geocoding, (req, res, next) => { 
    const id = req.params.userId;
    const updateOps = JSON.parse(req.body); 
    for(const key of Object.keys(updateOps)) {
        if(key === 'location') {
            updateOps['string_address'] = req.formatted_address;
        }
    }

    if(updateOps.password) {
        bcrypt.hash(updateOps.password, 10, (err, hash) => {
            updateOps.password = hash
            User.update({_id: id}, { $set: updateOps })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
    } else {
        User.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
