const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: String,

    name: {type: String, required: true}, 

    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/
    },
    
    password: {type: String, required: true}, 

    birthday: {type: String, required: true}, 

    gender: {type: String, required: true},

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
    
    string_address: {type: String},
    phone_number: {type: Number, required: true}

});

module.exports = mongoose.model('User', userSchema);
