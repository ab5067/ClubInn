// add order status 
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    _id: String,

    user: {type: String, ref: 'User', required: true}, 

    cart: {type: Object, required: true},
    order_placement_date: {type: String, required: true},

    booking_date: {type: Date, required: true},

    decoration: {type: Boolean, default: false}, 
    liquor: {type: Boolean, default: false},
    catering: {type: Boolean, default: false},

    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      },

    string_address: {type: String, required: true},

    payment_id: {type: String, required: true},

    order_status: {
        type: String, 
        enum: ['On Going', 'Completed', 'Cancelled'],
        required: true
    }, 
});

module.exports = mongoose.model('Order', orderSchema);