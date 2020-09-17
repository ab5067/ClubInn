const mongoose = require('mongoose');

const sheeshaSchema = mongoose.Schema({
    _id: String,

    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    productType: {type: String, default: 'sheesha', required: true},
    warehouse_quantity: {type: Number, min: 0},
});

module.exports = mongoose.model('Sheesha', sheeshaSchema);