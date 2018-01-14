var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  address: String,
  name: String,
  coords: { lat: Number, lng: Number },
  startTime: String,
  endTime: String,
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
