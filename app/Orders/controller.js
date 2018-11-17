const Order = require('./model');

const createOrder = function (req, res, next) {
  const {
    userId,
    restaurantId,
    items,
    totalCost
  } = req.body;

  const order = new Order({
    userId,
    restaurantId,
    items,
    totalCost
  });

  order
    .save()
    .then(order => {
      res.json({
        success: true,
        order,
      });
    });
};

const getOrderByUserOrRestaurant = function (req, res, next) {
  const {
    userId,
    restaurantId,
    status
  } = req.query;

  if(userId && restaurantId){
    Order
    .find({
        userId, 
        restaurantId,
    })
    .exec()
    .then((orders) => {
      res.json({
        orders
      });
    })
    .catch(e => next(e));
  }
  else if(userId){
    if(status){
      Order
      .find({
          userId,
          status
      })
      .exec()
      .then((orders) => {
        res.json({
          orders
        });
      })
      .catch(e => next(e));
    }
    else{
      Order
      .find({
          userId, 
      })
      .exec()
      .then((orders) => {
        res.json({
          orders
        });
      })
      .catch(e => next(e));
    }
  }
  else if(restaurantId){
    if(status){
      Order
      .find({
          restaurantId,
          status
      })
      .exec()
      .then((orders) => {
        res.json({
          orders
        });
      })
      .catch(e => next(e));
    }
    else{
      Order
      .find({
          restaurantId,
      })
      .exec()
      .then((orders) => {
        res.json({
          orders
        });
      })
      .catch(e => next(e));
    }
  }

};


const updateOrderById = function (req, res, next) {
  const {
    orderId,
  } = req.params;

  Order
    .findByIdAndUpdate(orderId, req.body, {new: true})
    .exec()
    .then(order => res.json(order))
    .catch(err => next(err));

};

module.exports = {
  createOrder,
  getOrderByUserOrRestaurant,
  updateOrderById
};