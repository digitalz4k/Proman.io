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

module.exports = mongoose.model('User', userSchema)

/*********************************************      TASK SCHEMA   ******************************************** */
var taskSchema = new mongoose.Schema({
    assignedTo: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
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

/* ********************************************      PROJECT SCHEMA   ******************************************** */
var projectSchema = new mongoose.Schema({
    projectName: { type: String,
                            required:true,
                            validate: [lengthValidator, 'Too short!']
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
    collaborators: [ { type: mongoose.Schema.ObjectId, ref:'User' } ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasks: [taskSchema]
});

projectSchema.statics.findByUserID = function(userid, callback){
    this.find(
        {createdBy: userid},
        '_id projectName',
        {sort: 'modifiedOn'},
        callback);
};

projectSchema.statics.jsonFindByUserId = function(userid, callback){
    this.find(
        {createdBy: userid},
        null,
        {sort: 'modifiedOn'},
        callback);
};

projectSchema.statics.findByProjectId = function(projectID, callback){
    this.find(
        {_id: projectID},
        callback);
};

module.exports = mongoose.model('Project', projectSchema)