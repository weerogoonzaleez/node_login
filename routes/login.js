var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var buscar = function(db, callback){collection.find({email:req.body.email, password: req.body.password} ,function(e,docs){
        
        console.log(docs);

        res.render('index', {
            
        });
    });
}
});

 

module.exports = router;