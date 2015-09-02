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
    env : {
      dev : {
        src : 'env_config/env_dev.json'
      },
      test: {
        src: 'env_config/env_dev.json'
      },
      prod: {
        src: 'env_config/env_prod.json'
      }
    },
    eslint: {
      target: ['./lib/**/*.js', 'Gruntfile.js', './test/**/*.js']
    },
    'node-inspector': {
      dev: {}
    },
    'exec': {
      tags: {
        cmd: 'ctags-exuberant -a -e -f TAGS --tag-relative -R lib test'
      }
    }
  });


  // register tasks
  grunt.registerTask('default', ['env:dev', 'nodemon']);
  grunt.registerTask('test', ['env:test', 'eslint', 'mochaTest']);
  grunt.registerTask('inspect', ['node-inspector']);
  grunt.registerTask('tags', ['exec:tags']);

};
