var mongoose = require('mongoose'),
    User = require('./user'),
    taskSchema = require('./task');

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

/* ********************************************      PROJECT SCHEMA   ******************************************** */
var projectSchema = new mongoose.Schema({
    projectName: { type: String,
                            required:true,
                            validate: [lengthValidator, 'Too short!']
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
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

module.exports = mongoose.model('Project', projectSchema);