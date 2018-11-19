const mongoose = require('mongoose');

const Orders = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
          {
            food : {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Food',
            },
            quantity: {
              type: Number
            },
            price: {
              type: Number
            }
          }
        ],
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['seleccionado', 'pedido', 'enviado', 'recibido'],
    default: 'seleccionado',
  },
  timestampCreated:{
    type: String,
    default: new Date()
  },
  timestampUpdated:{
    type: String,
  }
});

module.exports = mongoose.model('Orders', Orders);
