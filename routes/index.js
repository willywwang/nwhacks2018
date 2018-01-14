var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var geocoder = require('geocoder');
var request = require("request")

var Post = require('../models/post');

var router = express.Router();

// get home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Table for Two' });

  Post.find(function(err, posts) {
    if (err) return console.error(err);

    if (req.user) {
      Post.find({ userID: req.user.facebook.id }, function(err, userPosts) {
        if (err) {
          res.render('index', { title: 'Express', user: req.user, posts: JSON.stringify(posts) });
        } else {
          res.render('index', { title: 'Express', user: req.user, posts: JSON.stringify(posts), userPosts: JSON.stringify(userPosts) });
        }
      });
    } else {
      res.render('index', { title: 'Express', user: req.user, posts: JSON.stringify(posts) });
    }
  });

});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Express'});
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Express'});
});

router.get('/new', function(req, res) {
  console.log(req.user);
  res.render('new', {
    title: 'You are going... ', user: req.user
  });
});

// route for showing the profile page
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {
    user: req.user // get the user out of session and pass to template
  });
});

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/', // /profile
    failureRedirect: '/'
  }));

// route for logging out
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/add-outing', function(req, res) {
    if (req.user) { // check to make sure user is signed in
      geocoder.geocode(req.body.address, function(err, data) {
        var post = {
          address: req.body.address,
          coords: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng },
          timeGoing: req.body.timeGoing,
          userID  : req.user.facebook.id,
          userName: req.user.facebook.name,
          isSomeoneGoing: false
        };

        var newPost = new Post(post);
        newPost.save();
      });
    } else {
      console.log("You need to sign in");
    }

    res.redirect('/');
});

router.post('/join/:postID/:joiner', function(req, res) {
  console.log(req.params.postID);

  Post.findById(req.params.postID, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      doc.isSomeoneGoing = true;
      doc.personGoing = req.params.joiner;
      doc.save();
    }

  });

  res.redirect('/');
});

// route that cointains the restaurant data
router.post('/data', function(req, res) {

  var offset = req.body.offset;
  var lat = req.body.lat;
  var lon = req.body.lon;
  var radius = req.body.radius;

  var url = 'https://developers.zomato.com/api/v2.1/search?start=' + offset + '&lat=' + lat + '&lon=' + lon + '&radius=' + radius;
  var token = 'user_key';

    var options = {
          method: 'GET',
          url: url,
          headers: {
              'user_key': '39d7b0047f4d3176f7115db315b09012',
              "Content-Type": "application/json"
          }
      };

      request(options, function(error,response,body){
          res.send(body);
      });

});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}


module.exports = router;
