'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User');

exports.addTask = function(req, res) {
    console.log('PUT');
    console.log(req.body);

    Project.findById(req.params.projectID, function(err, project) {
        if(!err){
        project.tasks.push({
            taskName: req.body.taskName,
            taskDesc: req.body.taskDesc,
            createdBy: req.params.id
        });
        project.modifiedOn = Date.now();

    project.save(function (err) {
      if (!err) {
        console.log("New task added: " + req.body.taskName);
        res.json(200, {message: "New task added: " + req.body.taskName});
      } else {
        console.log("ERROR :" + err);
      }
      return res.send(project);
    });
    }
  });
};

exports.updateTask = function(req, res) {
    console.log('PUT');
    console.log(req.body);

    Project.findById(req.params.projectID, function(err, project) {
        if(!err){
             var task = project.tasks.id(req.params.taskID);
                    task.taskName = req.body.taskName;
                    task.taskDesc = req.body.taskDesc;
                    task.modifiedOn = Date.now();
                    task.createdBy = req.params.id;
                    project.modifiedOn = Date.now();
        }

    project.save(function (err) {
      if (!err) {
        console.log("Updated " + req.body.taskName);
        res.json(200, {message: "Task updated: " + req.body.taskName});
      } else {
        console.log("ERROR :" + err);
      }
      return res.send(project);
    });
  });
};

exports.deleteTask = function(req, res) {
    Project.findById(req.params.projectID, function(err, project) {
        if (!err && project){
          project.tasks.id(req.params.taskID).remove();
          project.save(function(err){
            if(!err){
                res.send(project);
            }
          })
          res.json(200, {message: "Task removed."});
        } else {
            res.json(403, {message: "Could not delete task. " + err});
          }
    });
  };

exports.createTask = function(req, res){
    res.render('task-form', {
        title: 'Add a new task',
        taskName: "",
        taskDesc: "",
        buttonText: "Add"
    });
};

exports.doCreateTask = function(req, res){
    Project.findById(req.params.id, 'tasks modifiedOn',
        function(err, project){
            if(!err){
                project.tasks.push({
                    taskName: req.body.taskName,
                    taskDesc: req.body.taskDesc,
                    createdBy: req.session.user._id
                });
                project.modifiedOn = Date.now();
                project.save(function(err, project){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Task saved: " + req.body.taskName);
                        res.redirect('/project/' + req.params.id);
                    }
                });
            }
        }
    );
};

exports.editTask = function(req, res){
    console.log("Editing taskID: " + req.params.taskID);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else {
        Project.findById(req.params.id, 'tasks modifiedOn',
            function(err, project){
                if(!err){
                    console.log(project.tasks);
                    var task = project.tasks.id(req.params.taskID);
                    res.render('task-form', {
                    title: 'Edit Task',
                    _id: task._id,
                    taskName: task.taskName,
                    taskDesc: task.taskDesc,
                    buttonText: "Save"
                });
                }
        });
    }
};

exports.doEditTask = function(req, res){
    if(req.params.id){
        Project.findById(req.params.id, 'tasks modifiedOn',
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project/' + req.params.id + '/task/edit/' + req.params.taskID);
                }
                else{
                    var task = project.tasks.id(req.params.taskID);
                    task.taskName = req.body.taskName;
                    task.taskDesc = req.body.taskDesc;
                    task.modifiedOn = Date.now();
                    task.createdBy = req.session.user._id;
                    project.modifiedOn = Date.now();
                    project.save(function(err, project){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Task updated :" + req.body.taskName);
                            res.redirect('/project/' + req.params.id);
                        }
                    });
                }
            }
        )
    }
};

exports.confirmDeleteTask = function(req, res){
    console.log("Delete confirmation taskID: " + req.params.taskID);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else {
        Project
        .findById(req.params.id)
        .populate('createdBy')
        .exec(
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project/' + req.params.id + '?error=deleting');
                }else{
                    var task = project.tasks.id(req.params.taskID);
                    res.render('task-delete-form', {
                        title: 'Delete Task',
                        userid: project.createdBy.name,
                        projectName: project.projectName,
                        taskName: task.taskName,
                        taskID: task._id
                    });
                }
            });
    }
};

exports.doDeleteTask = function(req, res){
    if(req.params.taskID){
        Project.findById(req.params.id,
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project/' + req.params.id + '?error=deleting');
                } else {
                    project.tasks.id(req.params.taskID).remove();
                    project.save(function(err, project){
                        if(err){
                            console.log(err);
                            res.redirect('/project/' + req.params.id + '?error=saving');
                        }
                            else{
                            console.log("Task removed." + project.tasks);
                            res.redirect('/project/' + req.params.id);
                        }
                    });
                }
            });
    }
};