const mongoose = require('mongoose');

const Orders = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  items: [
          {
            foodId : {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Food',
            },
          }
        ],
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['seleccionado', 'pedido', 'enviado', 'recibido'],
    default: 'selecionado',
  }
});

module.exports = mongoose.model('Orders', Orders);