const mongoose = require('mongoose');

const Restaurant = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  foods: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
    },
    price: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true
    },
  }],
  active: {
    type: Boolean,
    default: false,  
  }

});

module.exports = mongoose.model('Restaurant', Restaurant);