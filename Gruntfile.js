module.exports = function(grunt) {

  // Modules
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('bootcamp');
  grunt.loadNpmTasks('grunt-sassdoc');

  // Grunt Tasks
  grunt.initConfig({

    dir : {
      src : 'sass',
      dist : 'dist'
    },

    pkg: grunt.file.readJSON('package.json'),

    // Concat
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        src: [
          '<%= dir.src %>/position/_support.scss',
          '<%= dir.src %>/_position.scss'
        ],
        dest: '<%= dir.dist %>/_<%= pkg.name.toLowerCase() %>.scss',
      },
    },

    // Sass
    sass: {
      test: {
        options: {
          style: 'expanded',
          compass: false,
          bundleExec: true,
          loadPath: './node_modules/bootcamp/dist'
        },
        files: {
          './tmp/results.css': './test/test.scss'
        }
      }
    },

    // Tests
    bootcamp: {
      test: {
        files: {
          src: ['./tmp/results.css']
        }
      }
    },

    // Watch
    watch: {
      dist: {
        files: [
                './test/**/*.scss',
                './<%= dir.src %>/**/*.scss'
                ],
        tasks: ['test']
      }
    },

    // Docs
    sassdoc: {
      'default': {
        'src': './<%= dir.src %>',
        'dest': './docs',
        'options': {
          'config': './.sassdocrc'
        }
      }
    },

    open : {
      docs : {
        path: './docs/index.html',
        app: 'Google Chrome'
      }
    },

    // Versioning
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'version: Bump to %VERSION%',
        commitFiles: ['package.json', 'bower.json', 'docs/*', 'dist/*'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    }

  });

  // Tasks
  grunt.registerTask('test', ['sass', 'bootcamp']);
  grunt.registerTask('dev', ['test', 'watch']);
  grunt.registerTask('build', ['test', 'sassdoc', 'concat']);
  grunt.registerTask('docs', ['sassdoc', 'open:docs']);
  grunt.registerTask('patch', ['bump-only:patch', 'sassdoc', 'build', 'bump-commit']);
  grunt.registerTask('minor', ['bump-only:minor', 'sassdoc', 'build', 'bump-commit']);
};