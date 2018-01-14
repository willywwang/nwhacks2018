var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  address: String,
  coords: { lat: Number, lng: Number },
  startTime: Date,
  endTime: Date,
  userID: Number,
  userName: String,
  isSomeoneGoing: Boolean,
  personGoing: String,
  personGoingID: Number,
  personGoingEmail: String,
  date: { type: Date, default: Date.now }
});

var Post = mongoose.model('post', postSchema);

module.exports = Post;
