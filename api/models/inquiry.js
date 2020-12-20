const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    _id: String,

    inquiry_date: {type: Date, required: true},
    place: {
        id: {type: String, required: true},
        name: {type: String, required: true}
    },

    user: {
        id: {type: String},
        name: {type: String},
        email: {type: String},
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);