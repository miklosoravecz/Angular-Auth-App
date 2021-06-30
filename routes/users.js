const express = require('express');
const router = express.Router();
const passport =require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const getUserById = require('../models/user');


//Register
router.post('/register', 
//validation
body('name').notEmpty().withMessage('name is required!').isLength({ min: 5 }).withMessage('name must be minimum 5 characters long'),
body('username').notEmpty().withMessage('username is required!').isLength({ min: 5 }).withMessage('username must be minimum 5 characters long'),
body('email').isEmail().withMessage('must be valid email adress').notEmpty().withMessage('email is required '),
body('password').isLength({ min: 6 }).withMessage('password must be minimum 6 characters long!').notEmpty().withMessage('password is required'),

(req, res, next)=> {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        
        return msg;
        //return `${location}[${param}]: ${msg}`;
    };
  
    const errors = validationResult(req).formatWith(errorFormatter);
    
  
    if (!errors.isEmpty()) {
        //get message from error object
        let extracted = errors.mapped(({msg}) => msg)
        console.log(extracted)
  
       
  return res.status(400).json( extracted );
    }
    
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        created: new Date(new Date().getTime())
    });

    User.addUser(newUser, (err, user)=> {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
          
        
        } else {
            res.json({success: true, msg: 'User registered!'});
        }
    });
});


//Update user
router.put ('/:id', passport.authenticate('jwt', {session:false}), //validation
body('name').notEmpty().withMessage('name is required!').isLength({ min: 5 }).withMessage('name must be minimum 5 characters long'),
body('username').notEmpty().withMessage('username is required!').isLength({ min: 5 }).withMessage('username must be minimum 5 characters long'),
body('password').isLength({ min: 6 }).withMessage('password must be minimum 6 characters long!').notEmpty().withMessage('password is required'),
(req, res) => {
    
    // Validate Request
    if(!req.body.name||!req.body.username||!req.body.password) {
        return res.status(400).send({
            message: "All fields must be filled!"
        });
    }

    // Find note and update it with the request body
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,  
        username: req.body.username,
        password: req.body.password ,
        updated : Date.now()
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
       User.updateUser(user)
        //res.send(user);
        if(user) {
            const token = jwt.sign({data:user.toJSON()}, config.secret, {
                expiresIn: 604800 //1week
            });
            res.json({
                updated: true,
                token: 'Bearer '+ token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });
        } else {

            return res.json({success: false, msg: 'Failed to update user!'});
          
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
});

//Authenticate
router.post('/authenticate', (req, res, next)=> {
  
const username = req.body.username;
const password = req.body.password;

User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found!'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            
            if(isMatch) {
                const token = jwt.sign({data:user.toJSON()}, config.secret, {
                    expiresIn: 604800 //1week
                });
                res.json({
                    success: true,
                    token: 'Bearer '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
   
                return res.json({success: false, msg: 'Wrong username or password!'});
              
            }
        });
    });
});

//Delete user
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    User.findOneAndDelete({_id: req.params.id}, function (error, person){
        console.log("This object will get deleted " + person);
        if(error) {
            console.log(error, 'User not found')
        }
        res.json('User deleted!')
        console.log('User deleted')

    });
});

//Profile
router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next)=> {
   var id = req.params.id;
   
    res.json({user:req.user});
 
});

//Get all users
router.get('/', passport.authenticate('jwt', {session:false}),function (req, res) {
    User.find({}, function (err, users) {
        if(err){
            res.send('Something went wrong!');
            next();
        }
        res.send(users);
    })
   
});




module.exports = router;