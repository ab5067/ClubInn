const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Alcohol = require('../models/alcohol');

router.post('/', (req, res, next) => {
    const alcohol = new Alcohol ({
        _id: new mongoose.Types.ObjectId, 

        name: req.body.name, 
        price: req.body.price,
        description: req.body.description, 
        volume: req.body.volume,
        warehouse_quantity: req.body.warehouse_quantity,
        productType: req.body.productType,
    });
    alcohol
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Liquor Posted Sucessfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/', (req, res, next) => {
    Alcohol.find()
    .select('_id name price description volume productType')
    .exec()
    .then(docs => {
        //print(docs)
        const response = {
            count: docs.length,
            alcohol: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    volume: doc.volume,
                    description: doc.description,
                    productType: doc.productType,
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

router.patch('/:alcoholId', (req, res, next) => {
const id = req.params.alcoholId;
const updateOps = {};
for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
}
Alcohol.update({_id: id}, { $set: updateOps })
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

router.delete('/:alcoholId', (req, res, next) => {
const id = req.params.alcoholId;
Alcohol.remove({_id: id})
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