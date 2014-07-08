module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js ',
      'app/bower_components/underscore/underscore.js ',
      'app/bower_components/jquery/dist/jquery.js ',
      'app/bower_components/bootstrap/dist/js/bootstrap.js ',
      'app/bower_components/d3/d3.js ',
      'app/bower_components/nvd3/nv.d3.js',
      'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
      'app/bower_components/accounting/accounting.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],



    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
