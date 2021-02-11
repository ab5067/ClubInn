const mongoose = require('mongoose');

const packagesSchema = mongoose.Schema({
    _id: String,
    name: String,
    price: Number,
    details: Object,
    content: [Object],
    message: String, 
    listing: Boolean,
    productType: {type: String, default: 'package'},
});


module.exports = mongoose.model('Package', packagesSchema);