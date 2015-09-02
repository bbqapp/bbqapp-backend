var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
  meta: {
    mimetype: {type: String, required: true, match: /(image|video)/},
    url: String,
    createdAt: {type: Date, default: Date.now }
  },
  data: {type: Buffer, required: true},
  _place: { type: Schema.Types.ObjectId, ref: 'Place', required: true }
}, {collection: 'pictures'});

module.exports = mongoose.model('Picture', PictureSchema);
