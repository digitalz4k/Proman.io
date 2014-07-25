var mongoose = require('mongoose');

/************************
Validators
************************/
var lengthValidator = function(val){
    if(val && val.length >= 5){
        return true;
    }
    return false;
};

var emailValidator = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

/*********************************************      USER SCHEMA   ******************************************** */
var userSchema = new mongoose.Schema({
    name: { type: String,
                required: 'Cannot be empty.',
                validate: [lengthValidator, 'Too short!']
    },
    email: { type: String,
                unique: true,
                required: 'Cannot be empty.',
                validate: [emailValidator, 'Please fill a valid email address.']
     },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

console.log("User S. loaded.");
module.exports = mongoose.model('User', userSchema)