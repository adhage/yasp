module.exports = function(grunt) {
    // Project configuration.
    grunt.config('env', grunt.option('env') || process.env.GRUNT_ENV || 'development');
    
    var isDev = grunt.config('env') !== 'production';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
              beautify: isDev,
              mangle: !isDev
            },
            build: {
                files: {
                    'public/build/yasp.min.js': ["public/js/*.js"],
                }
            }
        },
        cssmin: {
            dark: {
                files: {
                    'public/build/yasp-dark.min.css': ['public/css/flaticon.css', 'public/css/font.css', 'public/css/navbar.css', 'public/css/yasp_home.css', 'public/css/yasp.css', 'public/css/dark.css']
                }
            },
            light: {
                files: {
                    'public/build/yasp.min.css': ['public/css/flaticon.css', 'public/css/font.css', 'public/css/navbar.css', 'public/css/yasp_home.css', 'public/css/yasp.css'],
                }
            }
        },
        jshint: {
            all: []
                //all: ['public/js/*.js','*.js']
        },
        watch: {
            js: {
                files: ['public/js/*.js'],
                tasks: ['uglify'],
            },
            css: {
                files: ['public/css/*.css'],
                tasks: ['cssmin'],
            }
        }
    });
    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Default task(s).
    
    grunt.registerTask('default',  ['uglify', 'cssmin', 'jshint']);
};