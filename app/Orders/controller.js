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
    restaurantId
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
  else if(restaurantId){
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

};

module.exports = {
  createOrder,
  getOrderByUserOrRestaurant,
};