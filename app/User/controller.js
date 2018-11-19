const User = require('./model');
const crypto = require('../utils/crypto');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const Restaurant = require('../Restaurant/model');

const register = function (req, res, next) {
  const {
    email,
    password,
    role,
    address,
    name,
    description,
  } = req.body;

  const hashedPassword = crypto.encrypt(password);
  User.findOne({ email })
  .exec()
  .then( user => {
    if(user){
      res.status(400).json({
        message: "Email ya existe. Si olvido contraseña, seleccione opcion para recuperarla",
        success: false,
      })
    }
    else{
      const newUser = new User({
        email,
        password: hashedPassword,
        role,
        address,
        name,
        description
      });
      newUser
        .save()
        .then((user) => {

          if(user.role === 'restaurant'){
            const restaurant = new Restaurant({
              name: name,
              details: description,
              _id: user._id,
            });

            restaurant
              .save()
          }

          res.json({
            user,
            success: true,
          });
        })
        .catch(e => next(e));
    }
  })

};

const getUsers = function (req, res, next) {
  const {
    userId
  } = req.params;

  if (userId) {
    User
      .findById(userId)
      .exec()
      .then(user => res.json(user))
      .catch(e => next(e));
  } else {
    User
      .find()
      .exec()
      .then(user => res.json(user))
      .catch(e => next(e));
  }

};

/* Delete a user */
const deleteUserById = function (req, res, next) {
  const {
    userId
  } = req.params;

  User
    .findByIdAndRemove(userId)
    .exec()
    .then(() => res.json({ success: true }))
    .catch(e => next(e));
};

// Login is a curried function which takes passport
const login = function (passport) {
  return function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'Usuario o contraseña erroneas',
          user   : user
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          next(err);
        }
        // Provide data since user is not a proper serialized object
        const token = jwt.sign(user.toObject(), 'secret_restaurant_app');
        return res.json({
          success: true,
          role: user.role,
          token,
          user: user.toObject(),
        });
      });
    })(req, res);
  };

};

const updateUserById = function (req, res, next) {
  const { _id: userId } = req.user;
  let { email, password } = req.body;
  console.log('Llega body ---->')
  console.log(req.body)
  let existingUser = null;
  if(email){
    User.findOne({ email })
    .exec()
    .then( user => {
      if(!user){
        existingUser = user;
        if(password){
          password = crypto.encrypt(password);
          req.body.password = password;
        }
        User
        .findByIdAndUpdate(userId, req.body, {new: true})
        .exec()
        .then(user => {
          if(user.role === 'restaurant'){
            Restaurant.findByIdAndUpdate(user._id, req.body)
            .exec()
          }
          res.json(user)
        })
        .catch(err => next(err));
        }
      else{
        res.status(400).json({
          message: 'No se puede cambiar al email seleccionado, debido a que ya existe',
          success: false,
        })
      }
    })
  }
  else{
    if(password){
      password = crypto.encrypt(password);
      req.body.password = password;
    }

    User
    .findByIdAndUpdate(userId, req.body, {new: true})
    .exec()
    .then(user => {
      if(user.role === 'restaurant'){
        Restaurant.findByIdAndUpdate(user._id, req.body)
        .exec()
      }
      res.json(user);
    })
    .catch(err => next(err));
  }

};


const recoverPsw  = function (req, res, next) {
  const {
    email
  } = req.query;
  let newPassword = "123456"
  User.findOne({email})
  .exec()
  .then( user => {
    if(user){
      user.password = crypto.encrypt(newPassword);
      user.save()
      .then( updatedUser => {
        sgMail.setApiKey('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');
        const msg = {
          to: email,
          from: 'psw@order.com',
          subject: 'Nueva contraseña',
          text: 'Su nueva contraseña es ' + newPassword + '',
          html: '<strong>Su nueva contraseña es ' + newPassword + ', por favor cambiela lo antes posible</strong>',
        };
        sgMail.send(msg);
        return res.json({
          success: true,
        });
      });
    }
    else{
      res.status(400).json({
        success: false,
        message: "Email no se encuentra registrado"
      })
    }
  })


  // using SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

};

module.exports = {
  register,
  getUsers,
  deleteUserById,
  login,
  updateUserById,
  recoverPsw
};
