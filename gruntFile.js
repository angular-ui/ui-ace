module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);

  var testConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, singleRun: true};
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: ['dots'] };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    karma: {
      unit: testConfig('test/karma.conf.js')
    },
    jshint:{
      files:['ui-ace.js', 'test/**/*.js', 'demo/**/*.js'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
