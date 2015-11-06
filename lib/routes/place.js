"use strict";  // eslint-disable-line

// 3th party libs
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var logger = require('../utils/logger');

// services
var placeService = require('../services/placeService');
var commentService = require('../services/commentService');
var pictureService = require('../services/pictureService');

// validators
var placeValidator = require('../validators/placeValidator');

// GET places via query, considering tags, location and radius
router.get('/', function(req, res, next) {
  var errors = placeValidator.validateGETPlaces(req);
  if (!_.isEmpty(errors)) {
    var err = new Error('GET places query no valid');
    err.status = 400;
    err.code = 'BAD_REQUEST';
    err.errors = errors;
    return next(err);
  }

  // split string to array
  // '9.1234,53.1234''  ==> ['9.1234', '53.1234']
  var locString = req.query.location.split(',');

  // convert strings to numbers
  var loc = _.map(locString, function(s) {
    return Number(_.trim(s));
  });

  var radius = req.query.radius || 10;  // 10 km is default radius

  var params = {};
  params.loc = loc;
  params.radius = radius;

  placeService.getPlaces(params, function(err, places) {
    if (err) {
      return next(err);
    }
    logger.debug('GET /places', {places: places});
    res.json(places);
  });
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  placeService.getPlaceById(id, function(err, place) {
    if (err) {
      return next(err);
    }
    res.json(place);
  });
});

// POST insert place(s) without picture
router.post('/', function(req, res, next) {

  logger.debug('POST /places');

  var errors = placeValidator.validatePOSTPlace(req);
  logger.debug('POST /places validation errors:', {errors: errors});
  if (!_.isEmpty(errors)) {
    var err = new Error('POST place request not valid');
    err.status = 400;
    err.code = 'BAD_REQUEST';
    err.errors = errors;
    return next(err);
  }

  var place = req.body;
  placeService.savePlace(place, function(err, newId) {
    if (err) {
      return next(err);
    }
    res.set('Content-Type', 'application/json');
    res.status(201).json({_id: newId});
  });
});

// POST insert new comment to existing place
router.post('/:id/comments', function(req, res, next) {
  var id = req.params.id;
  var comment = req.body;
  logger.debug('POST /:id/comments', {id: id,
                                      comment: comment,
                                      file: __filename,
                                      fn: 'router /:id/comments'});
  commentService.saveComment(id, comment, function(err, newId) {
    if (err) {
      return next(err);
    }
    res.status(201).json({_id: newId});
  });
});

// GET all comments for place
router.get('/:id/comments', function(req, res, next) {
  var id = req.params.id;
  commentService.getCommentsByPlaceId(id, function(err, comments) {
    if (err) {
      next(err);
    } else {
      res.json(comments);
    }
  });
});

// GET single comment for place
router.get('/:id/comments/:commentId', function(req, res, next) {
  var id = req.params.id;
  var commentId = req.params.commentId;
  commentService.getCommentByPlaceIdAndId(id, commentId, function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
});

// POST add picture to an existing place
router.post('/:id/pictures', function(req, res, next) {

  // get image from request body
  var id = req.params.id;
  var imgBuffer = req.body;
  var mimeType = req.get('Content-Type');

  pictureService.savePicture(id, imgBuffer, mimeType, function(err, newId) {
    if (err) {
      return next(err);
    }
    res.status(201).json({_id: newId});
  });
});

// GET single picture with binary data by placeId and pictureId
router.get('/:id/pictures/:pictureId', function(req, res, next) {
  var pictureId = req.params.pictureId;
  var id = req.params.id;
  pictureService.getPictureById(id, pictureId, function(err, picture) {
    if (err) {
      return next(err);
    }
    res.status(200);
    res.set('Content-Type', picture.meta.mimetype);
    res.send(picture.data);
  });
});

// GET all pictures for given place (exclude binary data)
router.get('/:id/pictures', function(req, res, next) {
  var id = req.params.id;

  pictureService.getPictures(id, function(err, pictures) {
    if (err) {
      return next(err);
    }
    res.status(200);
    res.json(pictures);
  });
});

module.exports = router;
