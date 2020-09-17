const mongoose = require('mongoose');

const alcoholSchema = mongoose.Schema({
    _id: String,

    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    productType: {type: String, default: 'alcohol', required: true},
    volume: {type: Number, required: true},
    warehouse_quantity: {type: Number, min: 0},
});

module.exports = mongoose.model('Alcohol', alcoholSchema);