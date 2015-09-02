var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: {type: String, required: true},
  score: {type: Number, required: true, max: 5},
  userid: {type: String, default: 'anonymous'},
  createdAt: {type: Date, default: Date.now },
  _place: {type: Schema.Types.ObjectId, ref: 'Place', required: true}
}, {collection: 'comments'});

module.exports = mongoose.model('Comment', CommentSchema);
