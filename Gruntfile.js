module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
        dist : {
            options: {
              configure : "./doc/jsdoc.conf.json",
                // destination: 'doc/api',
                // template: "./node_modules/minami",
                // template: "./node_modules/loke-jsdoc-theme",
                // template: "./node_modules/ink-docstrap",
                // template: "./node_modules/latodoc"
            }
        }
    },
    copy: {
      src:
        {
          cwd: './src',  // set working folder / root to copy
          src: '**/*',           // copy all files and subfolders
          dest: './doc/api/dist/src',    // destination folder
          expand: true           // required when using cwd
        },
      lib: {
          cwd: './lib',  // set working folder / root to copy
          src: '**/*',           // copy all files and subfolders
          dest: './doc/api/dist/lib',    // destination folder
          expand: true           // required when using cwd
        },
      css: {
          cwd: './css',  // set working folder / root to copy
          src: '**/*',           // copy all files and subfolders
          dest: './doc/api/dist/css',    // destination folder
          expand: true           // required when using cwd
        },
    },
    connect: {
			example: {
				port: 1337,
				base: './doc/api/index.html'
			}
		}
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-serve');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['jsdoc', 'copy']);
  grunt.registerTask('connect', ['connect']);


};



// EXAMPLE
// module.exports = function(grunt) {
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     bower: {
//       install: {
//         options: {
//           verbose: true,
//           layout: function(type, component, source) {
//             var path = require('path');
//             if (type == 'lib') return path.join();
//             return path.join(component, type); // 'byComponent'
//           }
//         }
//       }
//     },
//     clean: {
//       build: ['build'],
//       fb: ['fb'],
//       xdk: ['xdk'],
//       dist: ['dist'],
//       doc: ['doc'],
//     },
//     concat: {
//       dist: {
//         src: ['lib/melonJS-1.0.2.js', 'lib/plugins/*.js', 'js/game.js', 'js/resources.js','js/**/*.js','!js/social.js'],
//         dest: 'build/js/app.js'
//       },
//       fb: {
//         src: [
//           'lib/melonJS-1.0.2.js', 'lib/plugins/*.js',
//           'js/game.js', 'js/resources.js', 'js/**/*.js', 'js/social.js'
//         ],
//         dest: 'fb/js/app.js'
//       }
//     },
//     copy: {
//       build: {
//         files: [{
//           src: 'favicon.ico',
//           dest: 'build/'
//         },{
//           src: 'css/index.css',
//           dest: 'build/css/index.css'
//         },{
//           src: 'data/**/*',
//           dest: 'build/'
//         },{
//           src: 'css/**/*',
//           dest: 'build/'
//         }]
//       },
//       fb: {
//         files: [{
//           expand: true,
//           cwd: 'build/',
//           src: ['favicon.ico', 'index.html', 'css/**/*', 'data/**/*', 'js/**/*'],
//           dest: 'fb/'
//         }]
//       },
//       xdk: {
//         files: [{
//           expand: true,
//           cwd: './build/',
//           src: ['css/**/*', 'data/**/*', 'js/**/*'],
//           dest: 'xdk/',
//           // filter: 'isFile',
//         },{
//           expand: true,
//           flatten: true,
//           src: ['cordova/android/**'],
//           dest: 'xdk/assets/',
//           filter: 'isFile',
//         }]
//       }
//     },
//     processhtml: {
//       options: {
//         strip: true,
//         // process: true,
//       },
//       build: {
//         options: {
//           data: {
//             title: 'My app',
//             message: 'This is production distribution'
//           }
//         },
//         files: {
//           'build/index.html': ['index.html'],
//           'build/validate/index.html': ['validate/index.html']
//         }
//       },
//       xdk: {
//         options: {
//           strip: true,
//         },
//         files: {
//           'xdk/index.html': ['index.html'],
//         }
//       }
//     },
//     uglify: {
//       options: {
//         report: 'min',
//         preserveComments: 'some'
//       },
//       build: {
//         files: {
//           'build/js/app.min.js': [
//             'build/js/app.js'
//           ]
//         }
//       },
//       fb: {
//         files: {
//           'fb/js/app.min.js': [
//             'fb/js/app.js'
//           ]
//         }
//       }
//     },
//     watch: {
//       scripts: {
//         files: ['js/*.js', 'js/**/*.js'],
//         tasks: ['default'],
//         options: {
//           spawn: false,
//         },
//       },
//     },
//     jsdoc: {
//         dist : {
//             src: ['js/*.js', 'js/**/*.js', 'lib/melonJS-1.0.0.js'],
//             options: {
//                 destination: 'doc'
//             }
//         }
//     },
//     notify: {
//       build: {
//         options: {
//           message: 'Build completed'
//         }
//       }
//     }
//   });
//
//   grunt.loadNpmTasks('grunt-bower-task');
//   grunt.loadNpmTasks('grunt-contrib-concat');
//   grunt.loadNpmTasks('grunt-contrib-copy');
//   grunt.loadNpmTasks('grunt-contrib-clean');
//   grunt.loadNpmTasks('grunt-contrib-uglify');
//   grunt.loadNpmTasks('grunt-contrib-watch');
//   grunt.loadNpmTasks('grunt-processhtml');
//   grunt.loadNpmTasks('grunt-notify');
//   grunt.loadNpmTasks('grunt-jsdoc');
//   grunt.registerTask('fb', ['copy:fb', 'concat:fb', 'uglify:fb']);
//   grunt.registerTask('xdk', ['copy:xdk', 'processhtml:xdk']);
//   grunt.registerTask('build', ['clean', 'concat:dist', 'uglify:build', 'copy:build', 'processhtml:build', 'notify:build']);
//   grunt.registerTask('default', ['build', 'xdk', 'fb']);
// }
