var express = require('express');
var router = express.Router();

// get home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new', function(req, res) {
  res.render('new', { title: 'You are going... ' });
});


module.exports = router;
