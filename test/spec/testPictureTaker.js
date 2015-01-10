'use strict';

describe('Controller: CameraCtrl', function() {
       //inject modules via angular.mock.inject
    //for the playScreen the play-module is needed and the cssInjector
    beforeEach(angular.mock.module('pictureTaker'));
    beforeEach(angular.mock.module('angular.css.injector'));
    
 //   beforeEach(window.angular.mock.module('angular.css.injector'));

    

  var $controller;


  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
  }));
    
        

});