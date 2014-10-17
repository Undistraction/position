module.exports = function(grunt) {

  // Load all available grunt tasks
  require('load-grunt-tasks')(grunt);
  // Bootcamp doesn't use a `grunt-` prefix so load it manually
  grunt.loadNpmTasks('bootcamp');

  // Configure tasks
  grunt.initConfig({

    dir : {
      src : 'sass',
      dist : 'dist'
    },

    pkg: grunt.file.readJSON('package.json'),
    projectName: '<%= pkg.name.toLowerCase() %>',

    // Concat
    concat: {
      options: {
        separator: '\n\n',
        banner: '/*! <%= projectName %> v<%= pkg.version %> – <%= grunt.template.today("dd.mm.yyyy") %> */\n\n',
      },
      dist: {
        src: [
          '<%= dir.src %>/<%= projectName %>/_support.scss',
          '<%= dir.src %>/<%= projectName %>/_api.scss'
        ],
        dest: '<%= dir.dist %>/_<%= projectName %>.scss',
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

    // Shell
    shell: {
        options: {
            stderr: false
        },
        // Copy docs folder to gh-branch and push it
        ghpages: {
            command: [
              "git checkout gh-pages",
              "git checkout master ./docs",
              "git add -A",
              "git c -m 'docs: Update Docs to v<%= pkg.version %>'",
              "git push origin gh-pages",
              "git checkout master"
            ].join('&&')
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

  // Define own tasks
  grunt.registerTask('test', ['sass', 'bootcamp']);
  grunt.registerTask('dev', ['test', 'watch']);
  grunt.registerTask('build', ['test', 'sassdoc', 'concat']);
  grunt.registerTask('docs', ['sassdoc', 'open:docs']);
  grunt.registerTask('deploy', ['sassdoc', 'build', 'bump-commit', 'shell:ghpages'])
  grunt.registerTask('patch', ['bump-only:patch', 'deploy']);
  grunt.registerTask('minor', ['bump-only:minor', 'deploy']);
};