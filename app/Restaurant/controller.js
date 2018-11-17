const Restaurant = require('./model');
const Food = require('../Food/model');
const filter = require('lodash/filter');
const findIndex = require('lodash/findIndex');
const pick = require('lodash/pick');
const map = require('lodash/map');

// Get Restaurants by type
const getRestaurantsByType = function (req, res, next) {
  const {
    type,
  } = req.query;
  
  Restaurant
    .find()
    .populate('foods.food')
    .exec()
    .then(restaurants => {
      // returns all restaurants id, name and details
      let rests = [];
      restaurants.forEach( restaurant => {
        const food = restaurant.foods.find( food => food._doc.type === type )
        if(food){
          rests.push(pick(restaurant, ['_id', 'name', 'details', 'foods']))
        }
      })
      res.json(rests)
    })
    .catch(e => next(e));
};

// Gets all restaurants with food or gets restaurant food
const getAllRestaurants = function (req, res, next) {
  const {
    id,
  } = req.query;
  
  if (id) {
    Restaurant
      .findById(id)
      .populate('foods.food')
      .exec()
      .then(restaurants => res.json(restaurants))
      .catch(e => next(e));
  } else {
    Restaurant
      .find()
      .populate('foods.food')
      .exec()
      .then(restaurants => res.json(restaurants))
      .catch(e => next(e));
  }
};

// Creates a new restaurant 
const createRestaurant = function (req, res, next) {
  const {
    name,
    details,
    foods
  } = req.body;

  let newFoods = [];
  if(foods){
    foods.forEach( food => {
      let newFood = {};
      const { type, name } = food;
      newFood = new Food({
          name,
          type,
      });
      newFoods = newFoods.concat(newFood);
      newFood.save();
    })
  }

  const restaurant = new Restaurant({
    name,
    details,
    foods: foods ? newFoods : [],
  });

  restaurant
    .save()
    .then(restaurants => res.json(restaurants))
    .catch(e => next(e));
};

// Deletes a Restaurant
const deleteRestaurant = function (req, res, next) {
  const {
    id,
  } = req.params;

  Restaurant
    .findByIdAndRemove(id)
    .then(() => res.json({ success: true }))
    .catch(e => next(e));
  
};

// Adds a food to restaurant and creates a link to Food Model
const addFoodToRestaurant = function (req, res, next) {
  const {
    restaurantId,
    foodId,
    food,
    price,
  } = req.body;
  let newFood = {};
  if(food){
    const { type, name } = food;
    newFood = new Food({
      name,
      type,
    });
    newFood.save();
  }
  Restaurant
    .findByIdAndUpdate(restaurantId, {
      $push: {
        foods: {
          food: food ? newFood.id : foodId,
          price,
          active: false,
        }
      },
      
    })
    .exec()
    .then(restaurant => res.json(restaurant))
    .catch(e => next(e));
  
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantsByType,
  deleteRestaurant,
  addFoodToRestaurant,
};