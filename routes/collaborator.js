var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

exports.createCollaborator = function(req, res){
    res.render('collaborator-form', {
        title: 'Add a new collaborator',
        collaboratorID: "",
        buttonText: "Add"
    });
};

exports.doCreateCollaborator = function(req, res){
    Project.findById(req.params.id, 'collaborators modifiedOn',
        function(err, project){
            if(!err){
                var id = req.body.collaboratorID;
                project.collaborators.push(id);
                project.modifiedOn = Date.now();
                project.save(function(err, project){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Collaborator added: " + project);
                        res.redirect('/project/' + req.params.id);
                    }
                });
            }
            else {
                console.log(err);
            }
        }
    );
};

exports.confirmDeleteCollaborator = function(req, res){
    console.log("Delete confirmation collaboratorID: " + req.params.collaboratorID);
    if(req.session.loggedIn !== true){
        res.redirect('/login');
    }
    else {
        Project
        .findById(req.params.id)
        .populate('createdBy')
        .populate('collaborators')
        .exec(
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project/' + req.params.id + '?error=deleting');
                }else{
                    var id = req.params.collaboratorID
                    User
                        .findById(id)
                        .exec(function(err, user){
                            if(!err){
                            res.render('collaborator-delete-form', {
                                    title: 'Remove from the team',
                                    userid: project.createdBy.name,
                                    cName: user.name,
                                    collaboratorID: user._id
                                });
                            }
                        })
                    }
            });
    }
};

exports.doDeleteCollaborator = function(req, res){
    if(req.params.collaboratorID){
        Project.findById(req.params.id,
            function(err, project){
                if(err){
                    console.log(err);
                    res.redirect('/project/' + req.params.id + '?error=deleting');
                } else {
                    var id = req.params.collaboratorID;
                    project.collaborators.pull(id);
                    project.save(function(err, project){
                        if(err){
                            console.log(err);
                            res.redirect('/project/' + req.params.id + '?error=saving');
                        }
                            else{
                            console.log("Collaborator removed." + project.collaborators);
                            res.redirect('/project/' + req.params.id);
                        }
                    });
                }
            });
    }
};