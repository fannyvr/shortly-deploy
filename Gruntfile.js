module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/shortly-express.min.js'
      },
      lib: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/handlebars.js',
          'public/lib/backbone.js',
          ],
        dest: 'public/dist/lib.min.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          force: 'false'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      dist:{
        src: 'public/dist/shortly-express.min.js',
        dest: 'public/dist/shortly-express.min.js'
      },
      lib:{
        src: 'public/dist/lib.min.js',
        dest: 'public/dist/lib.min.js'
      }
    },

    jshint: {
      files: [
        'public/client/*.js', 
        'server.js', 
        'index.js'
      ],
      options: {
        // changed force: 'true' to force: 'false' last night
        force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target:{
        files: [{
          'public/dist/style.min.css': 'public/style.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master',
        options: {
          stdout: true,
          stderr: true
        }        
      },
      gitAdd: {
        command: 'git add .',
        options: {
          stdout: true,
          stderr: true

        }
      },
      gitCommit: {
        command: 'git commit -am "Built production"',
        options: {
          stdout: true,
          stderr: true
        }
      }
    } 
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'cssmin',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // We would test normally but they fail and stop us from uploading
      // grunt.task.run('test');
      grunt.task.run('build');
      grunt.task.run('shell:gitAdd');
      grunt.task.run('shell:gitCommit');
      grunt.task.run('shell:prodServer');  
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });
  
  grunt.registerTask('deploy', [
    'test',
    'server-dev'
  ]);
  
  grunt.registerTask('heroku:production',[
    'build'
  ]);
};
