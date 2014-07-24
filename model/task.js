var mongoose = require('mongoose')
    User = require('./user');

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

/*********************************************      TASK SCHEMA   ******************************************** */
var taskSchema = new mongoose.Schema({
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    taskName: { type: String,
                        required: 'Cannot be empty.',
                        validate: [lengthValidator, 'Too short!']
    },
    taskDesc: String,
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
                        required: true
    },
    modifiedOn: Date
});

module.exports = taskSchema;