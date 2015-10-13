var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var multer  = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var registro = require('./routes/registro');
var profile = require('./routes/profile');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');
var done=false;
var upload =  multer({ dest: './public/images'});

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(multer({ dest: './public/images/',
 rename: function (fieldname, filename) {
    return filename;
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));


app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/registro', registro);
app.use('/profile', profile);



app.post('/registro', function(req, res) {
    var db = req.db;
    
    var collection = db.get('usercollection');

    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        
        collection.insert({'email' : req.body.email, 'username':req.body.username, 'password': req.body.password, 'foto': req.files.foto.name}, function(err, result){
        console.log(result);
        res.redirect('/login');
    });


     
    });
});

app.post('/update', function(req, res) {
    var db = req.db;
    
    var collection = db.get('usercollection');

    collection.update(
      { '_id' : req.body.objid   },
      { $set: { 'username': req.body.username, 'email' : req.body.email } },
      function(err, results) {
        console.log(results);
        if(results=1){
          res.redirect('/login');
        }
    
    });
});


app.post('/login', function(req, res) {
  var db = req.db;
    var collection = db.get('usercollection');
  collection.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      //res.render('login.jade', { error: 'Invalid email or password.' });
      res.redirect('/login?error=1');
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info

        
        //req.session.email = req.body.email;
        res.render('profile', {title: 'ver variable', email: req.body.email, username: user.username, _id: user._id, foto: user.foto});
      } else {
        //res.render('login.jade', { error: 'Invalid email or password.' });
        res.redirect('/login?error=2');
      }
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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


module.exports = app;

