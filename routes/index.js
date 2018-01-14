var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var geocoder = require('geocoder');
var request = require("request");
var sendmail = require('sendmail')();

var Post = require('../models/post');
var User = require('../models/user');

var router = express.Router();

// get home page route
router.get('/', function(req, res, next) {
  var notifsPosts = [];

  Post.find(function(err, posts) {
    if (err) return console.error(err);

    if (req.user) {
      Post.find({ userID: req.user.facebook.id }, function(err, userPosts) {
        var posterImageUrl = "http://graph.facebook.com/" + req.user.facebook.id + "/picture?type=square"
        if (err) {
          res.render('index', { title: 'Express', user: req.user, posts: JSON.stringify(posts), profilePic: posterImageUrl });
        } else {
          var notifs = 0;
          for (var i = 0; i < userPosts.length; i++) {
            if (userPosts[i].isSomeoneGoing) {
              notifsPosts.push(userPosts[i]);
              notifs++;
            }
          }

          res.render('index', { title: 'Express', user: req.user, posts: JSON.stringify(posts),
            userPosts: JSON.stringify(userPosts), notifs: notifs, notifsPosts: notifsPosts, profilePic: posterImageUrl });
        }
      });
    } else {
      res.render('index', { title: 'Table for Two' });
    }
  });

});

router.get('/user', function(req, res) {
  res.send({
    data: req.user
  });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Express'});
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Express'});
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
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          userID  : req.user.facebook.id,
          userName: req.user.facebook.name,
          isSomeoneGoing: false
        };

        var newPost = new Post(post);
        console.log('p', post);
        console.log('np',newPost);
        newPost.save(function(err) {
          if (err) {
            console.log(err);
            return res.send({state:'failure'});
          }

          // if successful, return the new user
          return res.send({state: 'success'})
        });
      });
    } else {
      console.log("You need to sign in");
      res.send({state : 'failure'});
    }
  });


router.get('/post/address/:address', function(req, res) {
  Post.find({address: req.params.address}, function(err, data) {
    res.send(data);
  }, function(err) {
    console.log(err);
  });
});


router.post('/join/:postID/:joinerName/:joinerID/:joinerEmail', function(req, res) {
  console.log(req.params.postID);

  Post.findById(req.params.postID, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      doc.isSomeoneGoing = true;
      doc.personGoing = req.params.joinerName;
      doc.personGoingID = req.params.joinerID;
      doc.personGoingEmail = req.params.joinerEmail;
      doc.save();
    }

  });

  res.redirect('/');
});

router.post('/accept/:joinerEmail/:postID', function(req, res) {
  console.log(req.params.postID);
  console.log(req.params.joinerEmail);
  sendmail({
    from: req.user.facebook.email,
    to: req.params.joinerEmail,
    subject: "Let's eat!",
    html: "Hey, It's me " + req.user.facebook.name + ", and we are on to eat!",
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
  });

  Post.findByIdAndRemove(req.params.postID, (err, todo) => {
    res.redirect('/')
  });

});

// route that cointains the restaurant data
router.post('/data', function(req, res) {

  var offset = req.body.offset;
  var lat = req.body.lat;
  var lon = req.body.lon;
  var radius = req.body.radius;

  var url = 'https://api.yelp.com/v3/businesses/search?categories=restaurants' + '&latitude=' + lat + '&longitude=' + lon + '&radius=' + radius + '&sort_by=distance&limit=50&offset=' + offset;

  var options = {
    method: 'GET',
    url: url,
    headers: {
      'Authorization': 'Bearer 5oCSXV5l9pxICrBuXzbYrw4tUsMm_QGx0lF-4T1_GTZOHK8opKnoTI-UVn-XjqRQ5SxWcXqa_Ihbw4CnL8DF4fCyZJAorGpngb_en8MR9MD-f4n6j6HnNosnIhlbWnYx'
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
