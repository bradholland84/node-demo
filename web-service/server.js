/*
    server.js
    main server script for our task list web service
*/

//port name
var port = 8080;

//load all modules we need
var express = require('express');
var sqlite = require('sqlite3');
var bodyParser = require('body-parser');

//create new express app
var app = express();

//serve static subdir files
app.use(express.static(__dirname + '/static'));

//tell express to parse post body as json
app.use(bodyParser.json());

//api route for getting tasks
app.get('/api/tasks', function(req, res, next) {
    var sql = 'select rowid,title,done,createdOn from tasks where done != 1';
    db.all(sql, function(err, rows) {
        if (err) {
            return next(err);
        }

        //send rows back to client as JSON
        res.json(rows);
    });
});

//when someone posts to /api/tasks...
app.post('/api/tasks', function(req, res, next) {
    var newTask = {
        title: req.body.title,
        done:false,
        createdOn: new Date()
    };

    var sql = 'insert into tasks(title,done,createdOn) values(?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err) {
        if (err) {
            return next(err);
        }

        res.status(201).json(newTask);
    });
});

//create new database
var db = new sqlite.Database(__dirname + '/data/tasks.db', function(err) {
   if (err) {
       throw err;
   }
    var sql = 'create table if not exists tasks' +
        '(title string, done int, createdOn datetime)';
    db.run(sql, function(err) {
        if (err) {
            throw err;
        }
    })
});

//start the server
app.listen(port, function() {
    console.log('server is listening on http://localhost: ' + port);
});