'use strict';

var mongoose = require('mongoose'),
    validate = require('./middleware/validators'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
    assignedTo: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
    taskName: { type: String,
                        required: 'Cannot be empty.',
                        validate: [validate.lengthValidator, 'Too short!']
    },
    taskDesc: String,
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
                        required: true
    },
    modifiedOn: Date
});

module.exports = mongoose.model('Task', TaskSchema);