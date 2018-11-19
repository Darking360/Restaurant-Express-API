const Food = require('./model');
const Restaurant = require('../Restaurant/model');

// Creates a food
const createFood = function (req, res, next) {

  const {
    name,
    price,
    type,
  } = req.body;

  const { _id } = req.user;

  const food = new Food({
    name,
    type,
  });

  food
    .save()
    .then(food => {
      Restaurant.findById(_id).then((restaurant) => {
        restaurant.foods.push({ food: food._id, price });
        restaurant.save().then(() => {
          res.json(food);
        });
      });
    })
    .catch(err => next(err));
};

const getAllFood = function (req, res, next) {
  const {
    id,
    name,
  } = req.query;

  // If id is present get Particular item
  if (id) {
    Food
      .findById(id)
      .exec()
      .then(food => res.json(food))
      .catch(err => next(err));

  } else if (name) {
    Food
      .find({
        name:{'$regex' : name, '$options' : 'i'}
      })
      .populate({
        path: 'restaurant',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'foods.food' }
      })
      .exec()
      .then(foods => res.json(foods))
      .catch(e => next(e));
  } else {
  // If no id then get all
    Food
      .find()
      .exec()
      .then(food => res.json(food))
      .catch(err => next(err));
  }
};

// Deletes Food By id
const deleteFoodById = function (req, res, next) {

  const {
    id
  } = req.query;

  // Remove the element by Id
  Food
    .findByIdAndRemove(id)
    .exec()
    .then((food) => {
    
      Restaurant.findOne({ "foods.food": id})
      .exec()
      .then( restaurant => {
        restaurant.foods = restaurant.foods.filter( food => {
          return food.food != id})
        restaurant.save()
      })
      res.json({
          success: true,
      })
    })
    .catch(err => next(err));

};

// Updates Food By id
const updateFoodById = function (req, res, next) {
  const {
    foodId,
  } = req.params;

  Food
    .findByIdAndUpdate(foodId, req.body, {new: true})
    .exec()
    .then(food => res.json(food))
    .catch(err => next(err));

};

const getFoodType = function (req, res, next) {
  Food
    .find()
    .distinct('type')
    .exec()
    .then(types => res.json(types))
    .catch(err => next(err));
};

const search = function (req, res, next) {
  const {
    search,
  } = req.query;

  Food
    .find({name: new RegExp('^'+search+'$', "i")})
    .populate('restaurant')
    .then((foods) => {
      res.json(foods)
    })
    .catch(e => res.status(400).json({ messgae: 'Error buscando restaurantes' }));

};

module.exports = {
  createFood,
  getAllFood,
  deleteFoodById,
  updateFoodById,
  getFoodType,
  search,
};
