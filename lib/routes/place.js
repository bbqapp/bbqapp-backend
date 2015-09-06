"use strict";  // eslint-disable-line

var express = require('express');
var _ = require('lodash');
var router = express.Router();
var Place = require('../models/place.js');
var Picture = require('../models/picture.js');
var MyComment = require('../models/comment.js');
var logger = require('winston');
var mongoose = require('mongoose');

// GET places via query, considering tags, location and radius
router.get('/', function(req, res, next) {

  if (!req.query.location) {
    var err =  new Error('http query param location must be set!');
    err.status = 400;
    throw err;
  }

  // split string to array
  // '9.1234,53.1234''  ==> ['9.1234', '53.1234']
  var locString = _.words(req.query.location, /[^, ]+/g);

  // convert strings to numbers
  var loc = _.map(locString, function(s) {
    return Number(_.trim(s));
  });

  var radius = req.query.radius || 10;  // 10 km is default radius

  Place.find({
    location:
    { $geoWithin:
      { $centerSphere: [loc, radius/6378.1]}}}, function (err, places) {
        if (err) {
          logger.error(err);
          next(err);
          return;
        }
        res.json(places);
      });
});

router.get('/:id', function(req, res, next) {

  logger.debug('in GET /places/:id');
  var id = req.params.id;
  Place.findById(id, function(err, place) {
    if (err) {
      logger.error(err);
      err.status = 404;
      err.message = 'Not Found';
      next(err);
      return;
    }
    res.json(place);
  });
});

// POST insert place(s) without picture
router.post('/', function(req, res, next) {
  Place.create(req.body, function(err, place) {
    if (err) {
      logger.log('error', 'ERROR savePlace: %s', JSON.stringify(err));
      next(err);
      return;
    }
    res.set('Content-Type', 'application/json');
    // get and send back new generated place id
    res.status(201).send(_.pick(place, '_id'));
  });
});

// POST insert new comment to existing place
router.post('/:id/comments', function(req, res, next) {

  var id = req.params.id;
  var comment = req.body;
  // enricht comment with place id
  comment._place = mongoose.Types.ObjectId(id);

  MyComment.create(comment, function(err, entry) {
    if (err) {
      logger.log('error', 'saveComment: %s', JSON.stringify(err));
      next(err);
      return;
    }
    res.status(201).json({_id: entry._id});
  });

});

// GET all comments for place
router.get('/:id/comments', function(req, res, next) {

  var id = req.params.id;
  MyComment.find({_place: id}, function(err, comments) {
    if (err) {
      logger.error('GET comments for placeId: %s failed with error: %s',
                   id, JSON.stringify(err));
      next(err);
      return;
    }
    res.json(comments);
  });
});

// GET single comment for place
router.get('/:id/comments/:commentId', function(req, res, next) {

  var commentId = req.params.commentId;
  MyComment.findById(commentId, function(err, comment) {
    if (err) {
      logger.error('GET single comment with id %s failed with error: %s',
                   commentId, JSON.stringify(err));
      next(err);
      return;
    }
    res.json(comment);
  });
});

// POST add picture to an existing place
router.post('/:id/pictures', function(req, res, next) {

  // get image from request body
  var id = req.params.id;
  var imgBuffer = req.body;

  // save to mongodb
  Picture.create(
    { meta:
      {mimetype: req.get('Content-Type'),
       url: ''
      },
      data: imgBuffer,
      _place: mongoose.Types.ObjectId(id)},
    function(err, picture) {
      if (err) {
        logger.log('error','ERROR: savePicture: %s', JSON.stringify(err));
        next(err);
        return;
      }
      var url = '/places/' + id + '/pictures/' + picture._id;
      Picture.update(
        {_id: picture._id},
        {$set: {'meta.url': url}},
        function(err, raw) {    // eslint-disable-line
          // send 201 success with mongoID
          res.set('Content-Type', 'application/json');
          res.status(201).send(_.pick(picture, '_id'));
        });
    });
});

router.get('/:id/pictures/:pictureId', function(req, res, next) {
  Picture.findById(req.params.pictureId, function(err, picture) {
    if (err) {
      logger.log('error',
                 'ERROR: GET picture for pictureId %s, err: %s',
                 req.params.pictureid, JSON.stringify(err));
      next(err);
    }
    res.status(200);
    res.set('Content-Type', picture.meta.mimetype);
    res.send(picture.data);
  });
});

router.get('/:id/pictures', function(req, res, next) {
  // get all pictures for given place (exclude binary data)
  var id = req.params.id;
  Picture.find({_place: id}, {data: 0}, function(err, pictures) {
    if (err) {
      next(err);
    }
    res.json(pictures);
  });
});

module.exports = router;
