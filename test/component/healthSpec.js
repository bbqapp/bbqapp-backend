"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../../app.js');
var async = require('async');
var _ = require('lodash');

describe('/health', function() {
  it('GET /health should respond always with 200', function(done) {

    var fn = function(callback) {
      supertest(app).get('/health')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return callback(err);
          }
          var body = res.body;
          expect(body.status).to.be.equal('ok');
          callback(null);
        });
    };

    var healthRequests = _.map(_.range(4), function() {
      return fn;
    });

    // call health check 4 times
    async.parallel(healthRequests, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});
