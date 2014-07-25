//use Mongoose dependency
var mongoose = require('mongoose'),
    Project = require('./project');

//define Mongoose URI
var dbURI = 'mongodb://localhost/mongoosepm';

//Mongoose connection
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    console.log("Mongoose connected to " + dbURI);
});

mongoose.connection.on('error', function() {
    console.log("Mongoose connection error: " + err);
});

mongoose.connection.on('disconnected', function() {
    console.log("Mongoose connection disconnected");
});

process.on('SIGINT', function() {
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through app termination");
        process.exit(0);
    });
});