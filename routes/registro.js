var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('registro', { title: 'Express' });
});


router.post('/registro', function(req, res) {
    var db = req.db;
    var insertDocument = function(db, callback) {
   db.usercollection.insertOne( {
      "userlist" : {
         "username" : user.username,
         "email" : user.mail,
         "password" : user.password
         
      }
      
});
}});


module.exports = router;