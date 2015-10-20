"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../../app.js');
var async = require('async');
var Place = require('../../lib/models/place.js');
var Picture = require('../../lib/models/picture.js');
var MyComment = require('../../lib/models/comment.js');
var logger = require('../../lib/utils/logger');

describe('Comments CRUD', function() {
  before(function(done) {
    Place.remove(function(err, removedPlaces) { // eslint-disable-line
      Picture.remove(function(err, removedPictures) { // eslint-disable-line
        MyComment.remove(function(err, removedComments) { // eslint-disable-line
          done();
        });
      });
    });
  });

  describe('#addCommentToPlace()', function() {
    it('add comment', function(done) {
      async.waterfall([function(callback) {
        // save place
        var stuttgartSchlossplatz = {
          type: 'grillplatz',
          location:
          {type: 'Point', coordinates: [9.179931, 48.778648]},
          tags: ['grill', 'schlossplatz', 'with comment']
        };
        supertest(app).post('/api/places')
          .send(stuttgartSchlossplatz)
          .expect(201)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return;
            }
            var id = res.body._id;
            expect(id).to.be.ok; // eslint-disable-line
            callback(null, id);
          });

      }, function(id, callback) {
        // add comment
        var comment = {comment: 'comment text',
                       score: 4};
        supertest(app).post('/api/places/' + id + '/comments')
          .send(comment)
          .expect(201)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return;
            }
            var commentId = res.body._id;
            expect(commentId).to.be.ok;  // eslint-disable-line
            callback(null, id, commentId);  // pass ids to next function
          });
      }, function(id, commentId, callback) {
        // get all comments for place and check attributes
        supertest(app).get('/api/places/' + id + '/comments')
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return;
            }
            var comments = res.body;
            expect(comments[0]).to.be.ok;  // eslint-disable-line
            var comment = comments[0];
            expect(comment.createdAt).to.be.ok; // eslint-disable-line
            expect(comment.score).to.be.equal(4)
            expect(comment.comment).to.be.equal('comment text');
            callback(null, id, commentId);
          });
      }, function(id, commentId, callback) {
        // get single comment and check attributes
        supertest(app).get('/api/places/' + id + '/comments/' + commentId)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return;
            }
            var comment = res.body;
            expect(comment.createdAt).to.be.ok; // eslint-disable-line
            expect(comment.score).to.be.equal(4);
            expect(comment.comment).to.be.equal('comment text');
            callback(null, id, commentId);
          });
      }
                      ], function(err, result) { // eslint-disable-line
        if (err) {
          logger.log('error','ERROR: %s', JSON.stringify(err));
          done(err);
        } else {
          logger.debug('add comments successful');
          done();
        }
      });
    });
  });
});
