const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        
    },
    updated: {
        type: Date,
        
    }
});

// hash the password
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query= { username:username } 
    User.findOne(query, callback);
}




module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.updateUser = function(user, callback){
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(user.password, salt, (err, hash)=> {
            if(err) throw err;
            user.password = hash;
            user.save(callback);
        });
    });
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  }