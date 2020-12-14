
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const reverseGeoCoding = require('../middleware/geocoding');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 15
    },
    fileFilter: fileFilter
});

const Place = require('../models/places');
const Orders = require('../models/order');
const Inquiry = require('../models/inquiry');

router.post('/availability', async (req, res, next) => {
    data = JSON.parse(req.body);
    var bookingDate = data.booking_date;
    const placeID = data.placeID;
    var date = new Date(bookingDate);

    var query = {$and: [{booking_date: date},{'cart.items.id': placeID}]};
    var place = await Place.findById(placeID);

    const inquiry = new Inquiry({
        _id: new mongoose.Types.ObjectId,
        inquiry_date: date,
        place: {
            id: placeID,
            name: place.name
        }
    });

    await inquiry.save();

    Orders.find(query)
    .exec()
    .then(doc =>{
        if(doc.length) {
            if(doc[0].order_status == 'Cancelled') {
                res.status(200).json({
                    message: 'Place available'
                });
            } else {
                res.status(409).json({
                    message: 'Place alreay booked for the given date'
                }); 
            }
        } else {
            res.status(200).json({
                message: 'Place available'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

router.post('/', upload.array('placeImage', 15), reverseGeoCoding, (req, res, next) => {
var placeImagesPath = [];

const parsedData = req.body;

for(const image in req.files) {
    console.log(req.files[image].path)
    placeImagesPath.push(req.files[image].path)
}

    const place = new Place ({
        _id: new mongoose.Types.ObjectId,
        listing: parsedData.listing,
        name: parsedData.name,
        owner: parsedData.owner,

        location: parsedData.location,
        stringAddress: req.formatted_address,
        shortAddress: req.short_address,

        price: parsedData.price,
        vendorPrice: parsedData.vendorPrice,
        paxCapacity: parsedData.paxCapacity,
        placeImage: placeImagesPath,
        productType: parsedData.productType,
        description: parsedData.description,
        placeType: parsedData.placeType,

        amenities: parsedData.amenities
    });
    place
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Place Posted Sucessfully"
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
    const ID = req.params.userId
    Place.find({user: ID})
    .select('_id name location price')
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/property-filter/:placeType', (req, res, next) => {
    console.log(req.params.placeType);
    
    Place
    .find({placeType: {$in: [req.params.placeType, 'Hybrid']}})
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            placesTypes: placeTypes,
            places: docs
        }
        res.status(200).json(response)
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/', (req, res, next) => {
    
Place.find({listing: true})
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            places: docs
        }
        res.status(200).json(response)
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:placesId', (req, res, next) => { 
const id = req.params.placesId;
const updateOps = req.body; 
for(const key of Object.keys(updateOps)) {
    console.log(key, updateOps[key]);
}
Place.update({_id: id}, { $set: updateOps })
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
});

router.delete('/:placesId', (req, res, next) => {
const id = req.params.placesId;
Place.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

module.exports = router;
