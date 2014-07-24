var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User');

exports.findAllProjects = function(req, res){
    Project.find(function(err, project){
        if(err){
            console.log(err);
        }else{
            res.send(project);
        }
    });
};

exports.findAllProjectsByUserId = function(req, res){
    Project
        .jsonFindByUserId(req.params.id,
            function(err, projects){
            if(err){
                console.log(err);
            }else{
                res.send(projects);
            }
        });
};

exports.addProject = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var project = new Project({
        projectName: req.body.ProjectName,
        tasks: req.body.Tasks,
        createdBy: req.params.id
    })

    project.save(function(err) {
        if(!err) {
            console.log('Created a new project: ' + req.body.ProjectName);
        } else {
            console.log('ERROR: ' + err);
        }
    });

    res.send(project);
  };

  exports.findProject = function(req, res){
    Project
        .jsonFindByUserId(req.params.id, function(err, projects){
        if(err){
            console.log(err);
        }else{
            Project.findByProjectId(req.params.projectID, function(err, project){
                console.log(project);
                res.send(project);
            });
        };
    });
  };

  exports.updateProject = function(req, res) {
    console.log('PUT');
    console.log(req.body);

    Project.findById(req.params.projectID, function(err, project) {
        project.projectName = req.body.ProjectName;
        project.createdBy = req.params.id;
        project.tasks = req.body.Tasks;
        project.modifiedOn = Date.now();

    project.save(function (err) {
      if (!err) {
        console.log("Updated " + req.body.name);
      } else {
        console.log("ERROR :" + err);
      }
      return res.send(project);
    });
  });
};

exports.deleteProject = function(req, res) {
    Project.findById(req.params.projectID, function(err, project) {
        if (!err && project){
          project.remove();
          res.json(200, {message: "Project removed."});
        } else {
            res.json(403, {message: "Could not delete project. " + err});
          }
    });
  };

exports.create = function(req, res){
    res.render('project-form', {
        title: 'Create project',
        projectName: "",
        tasks: "",
        buttonText: "Start!"
    });
};

exports.doCreate = function(req, res){
    Project.create({
        projectName: req.body.ProjectName,
        tasks: req.body.Tasks,
        modifiedOn: Date.now(),
        createdBy: req.session.user._id
    }, function(err, project){
        if(!err){
        console.log("Project created and saved: " + project);
        res.redirect('/project/'+ project.id);
        }
    });
};

exports.byUser = function(req, res){
    console.log("Getting user projects");
    if(req.params.userid){
        Project
        .findByUserID(req.params.userid,
        function(err, projects){
                    if(!err){
                        console.log(projects);
                        res.json(projects);
                    }else{
                        console.log(err);
                        res.json({"status": "error",  "error": "Error finding projects."});
                    }
                });
    }else{
        console.log("No user id supplied");
        res.json({"status": "error", "error": "No user id supplied."});
    }
};

exports.displayInfo = function(req, res){
    console.log("Finding project_id: " + req.params.id);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else {
        if(req.params.id){
            Project
            .findById(req.params.id)
            .populate('createdBy', 'name email')
            .exec(function(err, project){
                    if(err){
                        console.log(err);
                        res.redirect('/user?404=project');
                    }else{
                        console.log(project);
                        res.render('project-page', {
                            title: project.projectName,
                            projectName: project.projectName,
                            tasks: project.tasks,
                            createdBy: project.createdBy,
                            projectID: req.params.id
                        });
                    }
                });
        }else{
            res.redirect('/user');
        }
    }
};

exports.edit = function(req, res){
    console.log("Editing project_id: " + req.params.id);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else{
        Project.findById(req.params.id)
        .populate('createdBy', 'name email')
        .exec(
            function(err, project){
            if(err){
                console.log(err);
                res.redirect('/project?error=finding');
            }else{
                    console.log(project);
                    res.render('project-form', {
                    title: 'Edit Project',
                    _id: req.params.id,
                    projectName: project.projectName,
                    userid: project.createdBy,
                    tasks: project.tasks,
                    buttonText: "Save"
                });
            }
        });
    };
};

exports.doEdit = function(req, res){
    if(req.params.id){
        Project.findById(req.params.id, function(err, project){
            if(err){
                console.log(err);
                res.redirect('/project?error=finding');
            }else{
                project.projectName = req.body.ProjectName;
                project.createdBy = req.session.user._id;
                project.tasks = req.body.Tasks;
                project.modifiedOn = Date.now();
                project.save(function(err){
                    if(!err){
                        console.log("Project updated " + req.body.projectName);
                        res.redirect("/project/" + req.params.id);
                    }
                });
            }
        });
    };
};

exports.confirmDelete = function(req, res){
    console.log("Delete confirmation project_id: " + req.params.id);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else{
        Project
        .findById(req.params.id)
        .populate('createdBy', 'name email')
        .exec(
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect("/project?error=deleting");
                }
                else {
                    res.render('project-delete-form', {
                        title: 'Delete Project',
                        projectID: req.params.id,
                        projectName: project.projectName,
                        userid: project.createdBy.name,
                        tasks: project.tasks
                    });
                };
            }
        );
    }
};

exports.doDelete = function(req,res){
    if(req.body.projectID){
        Project.findByIdAndRemove(
            req.body.projectID,
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project?error=deleting');
                };
                console.log("Project removed " + project);
                res.redirect('/user');
            }
        );
    }
};