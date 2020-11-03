const mongoose = require('mongoose');

const placesSchema = mongoose.Schema({
    _id: String,
    listing: {type: Boolean, default: true},

    name: {type: String, required: true},

    owner: {
      name: {type: String, required:true},
      contact: {type: Number, required: true},
      email: { 
        type: String, 
        required: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/
      },
    },

    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      },
    
    stringAddress: {type: String, required:true},
      
    productType: {type: String, default: 'place', required: true},
    price: {type: Object, required: true},
    paxCapacity: {type: Number, required: true},

    description: {type: String, required: true},
    placeImage: {type: [String], required: true},

    placeType: {type: String, required: true},

    amenities: {type: Object, required: true}
});

module.exports = mongoose.model('Place', placesSchema);