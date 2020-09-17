const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Sheesha = require('../models/sheesha');

router.post('/', (req, res, next) => {
    const sheesha = new Sheesha ({
        _id: new mongoose.Types.ObjectId, 

        name: req.body.name, 
        price: req.body.price,
        description: req.body.description, 
        warehouse_quantity: req.body.warehouse_quantity,
        productType: req.body.productType,
    });
    sheesha
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Sheesha Posted Sucessfully"
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
    Sheesha.find()
    .select('_id name price description productType')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            sheesha: docs.map(doc => {
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

router.patch('/:sheeshaId', (req, res, next) => {
const id = req.params.sheeshaId;
const updateOps = {};
for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
}
Sheesha.update({_id: id}, { $set: updateOps })
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

router.delete('/:sheeshaId', (req, res, next) => {
const id = req.params.sheeshaId;
Sheesha.remove({_id: id})
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