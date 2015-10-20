"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../../app.js');
var mongoose = require('mongoose');
var async = require('async');
var Place = require('../../lib/models/place.js');
var Picture = require('../../lib/models/picture.js');
var logger = require('../../lib/utils/logger');
var fs = require('fs');

after(function(done) {
  mongoose.disconnect();
  done();
});

describe('#addPictureToPlace()', function() {
  before(function(done) {
    // mongoose connect is already done in app.js
    Place.remove(function(err, removed) { // eslint-disable-line
      Picture.remove(function(err, removed) { // eslint-disable-line
        done();
      });
    });
  });

  it('add picture to place', function(done) {
    async.waterfall([function(callback) {
      // save place
      var stuttgartSchlossplatz = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [9.179931, 48.778648]},
        tags: ['grill', 'schlossplatz']
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
          logger.log('debug','insertPlace(): returned id: %s', id);
          expect(id).to.be.ok; // eslint-disable-line
          callback(null, id);
        });
    }, function(id, callback) {
      fs.readFile('test/files/file.jpg', function(err, data) {
        if (err) {
          callback(err);
          return;
        }
        // add picture to place
        supertest(app).post('/api/places/' + id + '/pictures')
          .set('Content-Type', 'image/jpeg')
          .set('Content-Length', data.length)
          .send(data)
          .expect(201)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return;
            }
            var pictureId = res.body._id;
            callback(null, id, pictureId);
          });
      });
    },function(id, pictureId, callback) {
      // verify pictures binary data is accessable via REST
      supertest(app).get('/api/places/' + id +'/pictures/' + pictureId)
        .expect(200)
        .expect('Content-Type', /image/)
        .end(function(err, res) { // eslint-disable-line
          if (err) {
            callback(err);
            return;
          }
          callback(null, id, pictureId);
        });
    }, function(id, pictureId, callback) {
      // verify picture meta data is set (createdAt, url, mimetype)
      supertest(app).get('/api/places/' + id + '/pictures')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end(function(err, res) {
          if (err) {
            callback(err);
            return;
          }
          var pictures = res.body;
          expect(pictures).to.have.length(1);
          var p = pictures[0];
          expect(p.meta.mimetype).to.be.equal('image/jpeg');
          expect(p.meta.createdAt).to.be.ok; // eslint-disable-line
          expect(p.meta.url).to.be.ok;
          expect(p._place).to.be.equal(id);

          callback(null, pictureId);
        });
    }
   ], function(err ,result) { // eslint-disable-line
      if (err) {
        logger.log('error','ERROR: %s', JSON.stringify(err));
        done(err);
      } else {
        done();
      }
    });
  });
});
