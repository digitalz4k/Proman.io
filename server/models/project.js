'use strict';

var mongoose = require('mongoose'),
    validate = require('./middleware/validators'),
    TaskSchema = require('./task'),
    Schema = mongoose.Schema;

var projectSchema = new Schema({
    projectName: { type: String,
                            required:true,
                            validate: [validate.lengthValidator, 'Too short!']
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
    collaborators: [ { type: mongoose.Schema.ObjectId, ref:'User' } ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasks: [TaskSchema]
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