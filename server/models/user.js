'use strict';

var mongoose = require('mongoose'),
    validate = require('./middleware/validators'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String,
                required: 'Cannot be empty.',
                validate: [validate.lengthValidator, 'Too short!']
    },
    email: { type: String,
                unique: true,
                required: 'Cannot be empty.',
                validate: [validate.emailValidator, 'Please fill a valid email address.']
     },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

module.exports = mongoose.model('User', userSchema);