const Order = require('./model');

const createOrder = function (req, res, next) {
  const {
    items,
    totalCost
  } = req.body;

  const { _id: userId } = req.user;

  const order = new Order({
    userId,
    items: items.map( item => ({...item, food: item.id}) ),
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
    restaurantId,
    status,
  //  userId
  } = req.query;

  let { _id: userId } = req.user;

  if(userId && restaurantId){
    Order
    .find({
        userId,
        restaurantId,
    })
     .populate('items.food')
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
     .populate('items.food')
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
     .populate('items.food')
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
  const body = Object.assign({timestampUpdated: new Date()}, req.body);
  Order
    .findByIdAndUpdate(orderId, body, {new: true})
    .exec()
    .then(order => res.json(order))
    .catch(err => next(err));

};

module.exports = {
  createOrder,
  getOrderByUserOrRestaurant,
  updateOrderById
};
