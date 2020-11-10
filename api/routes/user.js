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
    const data = JSON.parse(req.body);//add JSON.parse(req.body) when using app 
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
                        name: user[0].name,
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

router.post('/support', (req, res, next) => {
    var numbers = ['+91 90079 07083', '+91 83370 63223'];
    var emails = ['clubinn.in@gmail.com'];
    
    res.status(200).json({
        contact_number: numbers,
        email: emails
    });
});

router.post('/aboutus', (req, res, next) => {
    var aboutUsMessage1 = "Founded in August of 2019 and based in Kolkata, India. ClubInn is a trusted online platform for people to list, explore, or book unique spaces around the city for events and celebrations.";
    var aboutUsMessage2 = "Whether it is your bachelors before marriage, anniversary party after marriage, or your kid’s birthday party, ClubInn helps you arrange all events and celebrations in just a few clicks. An economic empowerment engine that allows people to monetise their extra space, world-class arrangements done in a record timing of just 1 day, a growing community of users, all of this together is pushing ClubInn to become the next biggest events chain of the world.";
    var founders = [
        {
            "name": 'Arsh Bansal',
            "position": "Co-founder"
        },
        {
            "name": 'Yash Jalan',
            "position": "Co-founder"
        },
        {
            "name": 'Shivam Agarwal',
            "position": "Co-founder"
        }
    ];
    res.status(200).json({
        message1: aboutUsMessage1,
        message2: aboutUsMessage2,
        founders: founders
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
