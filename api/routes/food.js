const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Food = require('../models/food');

router.post('/', (req, res, next) => {
    const food = new Food ({
        _id: new mongoose.Types.ObjectId, 

        name: req.body.name, 
        price: req.body.price,
        description: req.body.description, 
        warehouse_quantity: req.body.warehouse_quantity,
        productType: req.body.productType,
    });
    food
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Food Item Posted Sucessfully"
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
    Food.find()
    .select('_id name price description productType')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            food: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
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

router.patch('/:foodId', (req, res, next) => {
const id = req.params.foodId;
const updateOps = {};
for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
}
Food.update({_id: id}, { $set: updateOps })
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

router.delete('/:foodId', (req, res, next) => {
const id = req.params.foodId;
Food.remove({_id: id})
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