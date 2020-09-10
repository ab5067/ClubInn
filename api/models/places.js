const mongoose = require('mongoose');

const placesSchema = mongoose.Schema({
    _id: String,

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
    price: {type: Number, required: true},
    paxCapacity: {type: Number, required: true},

    description: {type: String, required: true},
    placeImage: {type: [String], required: true},

    amenities: {
      Food: {type: Boolean, default: false},
      Alcohol: {type: Boolean, default: false}, 
      Sheesha: {type: Boolean, default: false},
      Music: {type: Boolean, default: false},
      AirConditioning: {type: Boolean, default: false},
      WiFi: {type: Boolean, default: false}
    }
});

module.exports = mongoose.model('Place', placesSchema);