"use strict"; // eslint-disable-line quotes

var _ = require('lodash');

/**
 * See book Functional Javascript from Michael Fogus chapter 4
 * 'Putting it Al Together: Object Validators'
 */
var my = {
  checker: function(/* validators */) {
    var validators = _.toArray(arguments);

    return function(obj) {
      return _.reduce(validators, function(errs, check) {
        if (check(obj)) {
          return errs;
        } else {
          return _.chain(errs)
            .push({reason: check.reason, message: check.message}).value();
        }
      }, []);
    };
  },
  validator: function(message, reason, fun) {
    var f = function(/* args */) {
      return fun.apply(fun, arguments);
    };

    f.message = message;
    f.reason = reason;
    return f;
  }
};

module.exports = my;
