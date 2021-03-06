"use strict";  // eslint-disable-line

module.exports = function(grunt) {

  // load plugins
  ['grunt-mocha-test', 'grunt-nodemon', 'grunt-exec',
   'grunt-env', 'grunt-node-inspector', 'grunt-eslint']
    .forEach(function(task) {
      grunt.loadNpmTasks(task);
    });

  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'bin/www'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          caputureFile: 'results.txt'
        },
        src: ['test/**/*.js']
      }
    },
    eslint: {
      target: ['./lib/**/*.js', 'app.js', 'Gruntfile.js', './test/**/*.js']
    },
    'node-inspector': {
      dev: {}
    },
    'exec': {
      tags: {
        cmd: 'ctags-exuberant -a -e -f TAGS --tag-relative -R lib test app.js Gruntfile.js'
      },
      'swagger': {
        cmd: 'swagger project edit'
      }
    }
  });

  // register tasks
  grunt.registerTask('default', ['eslint', 'nodemon']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('inspect', ['node-inspector']);
  grunt.registerTask('tags', ['exec:tags']);
  grunt.registerTask('swagger', ['exec:swagger']);

};
