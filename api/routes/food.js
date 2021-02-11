const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Food = require('../models/food');

router.post('/', (req, res, next) => {
    const data = JSON.parse(req.body);
    const food = new Food ({
        _id: new mongoose.Types.ObjectId, 

        name: data.name, 
        price: data.price,
        description: data.description, 
        warehouse_quantity: data.warehouse_quantity,
        productType: data.productType,
        foodType: data.foodType
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

    var foodCategories = [
        {"Appetizer": []},
        {"North Indian": []},
        {"Breads & Rice": []},
    ];

    var foodImagesLinks = [
        "food_images/UR_Image1.png",
        "food_images/UR_Image2.png",
        "food_images/UR_Image3.png",
        "food_images/UR_Image4.png",
        "food_images/UR_Image5.png",
        "food_images/UR_Image6.png"
    ]

    Food.find()
    .select('_id name price description productType foodType')
    .exec()
    .then(docs => {

        for(const food of docs) {
            for(var [i, categoryObject] of foodCategories.entries()) {
                var category = Object.keys(categoryObject)[0]
                if(category === food.foodType) {
                    foodCategories[i][category].push(food);
                    break;
                }
            }
        }
       
        const response = {
            foodImagesLinks: foodImagesLinks,
            count: docs.length,
            food: foodCategories
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