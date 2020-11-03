const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    _id: String,

    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    productType: {type: String, default: 'food', required: true},
    foodType: {type: String, required: true},
});

module.exports = mongoose.model('Food', foodSchema);