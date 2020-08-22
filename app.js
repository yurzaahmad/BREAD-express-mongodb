var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var app = express();


var usersRouter = require('./routes/users');


// Use connect method to connect to the server
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);


// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'tabeldb';

MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const indexRouter = require('./routes/index')(db);
  app.use('/', indexRouter);
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});


module.exports = app;
