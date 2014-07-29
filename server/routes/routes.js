'use strict';

var index = require('./lib'),
    user = require('./lib/users'),
    project = require('./lib/projects'),
    task = require('./lib/tasks'),
    collaborator = require('./lib/collaborators');

module.exports = function(app) {

app.route('/')
    .get(index.index)

// API Routing

app.get('/api', function (req, res) {
  res.send('Proman.io API is running ! Actual version: 1.0. You must use the path /api/v1/ in order to use the API without restrictions.');
});

app.route('/api/v1/users')
    .get(user.findAllUsers)
    .post(user.addUser)

app.route('/api/v1/users/:id')
    .get(user.findUser)
    .put(user.updateUser)
    .delete(user.deleteUser)

app.route('/api/v1/projects')
    .get(project.findAllProjects)

app.route('/api/v1/users/:id/projects')
    .get(project.findAllProjectsByUserId)
    .post(project.addProject)

app.route('/api/v1/users/:id/projects/:projectID')
    .get(project.findProject)
    .put(project.updateProject)
    .delete(project.deleteProject)

app.route('/api/v1/users/:id/projects/:projectID/task')
    .post(task.addTask)

app.route('/api/v1/users/:id/projects/:projectID/task/:taskID')
    .put(task.updateTask)
    .delete(task.deleteTask)

//USER ROUTES
app.route('/user')
    .get(user.index)

app.route('/user/new')
    .get(user.create)
    .post(user.doCreate)

app.route('/user/edit')
    .get(user.edit)
    .post(user.doEdit)

app.route('/user/delete')
    .get(user.confirmDelete)
    .post(user.doDelete)

app.route('/login')
    .get(user.login)
    .post(user.doLogin)

app.route('/logout')
    .get(user.doLogout)

//PROJECT ROUTES
app.route('/project/new')
    .get(project.create)
    .post(project.doCreate)

app.route('/project/byuser/:userid')
    .get(project.byUser)

app.route('/project/:id')
    .get(project.displayInfo)

app.route('/project/edit/:id')
    .get(project.edit)
    .post(project.doEdit)

app.route('/project/delete/:id')
    .get(project.confirmDelete)
    .post(project.doDelete)

//TASK ROUTES

app.route('/project/:id/task/new')
    .get(task.createTask)
    .post(task.doCreateTask)

app.route('/project/:id/task/edit/:taskID')
    .get(task.editTask)
    .post(task.doEditTask)

app.route('/project/:id/task/delete/:taskID')
    .get(task.confirmDeleteTask)
    .post(task.doDeleteTask)

//COLLABORATORS ROUTES

app.route('/project/:id/collaborators/new')
    .get(collaborator.createCollaborator)
    .post(collaborator.doCreateCollaborator)

app.route('/project/:id/collaborators/delete/:collaboratorID')
    .get(collaborator.confirmDeleteCollaborator)
    .post(collaborator.doDeleteCollaborator)

// All undefined api routes should return a 404
  app.route('/api/v1/*')
    .get(function(req, res) {
      res.send(404);
    });

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

};