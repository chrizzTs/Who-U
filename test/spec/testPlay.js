"use strict"

describe('Controller: playCtrl', function() {
    
    
    //inject modules via angular.mock.inject
    //for the playScreen the play-module is needed and the cssInjector
    beforeEach(angular.mock.module('play'));
    beforeEach(angular.mock.module('angular.css.injector'));
    
 //   beforeEach(window.angular.mock.module('angular.css.injector'));

    

  var $controller;


  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
  }));
    
        
    


    it("splits the enumeration if it is one", function() {
        
        //inject Scope and Controller
        var $scope = {};
        var controller = $controller('playCtrl', {$scope: $scope });
        
        //Some random inputs the controler needs for his work
        //it has to be a enumeration
        $scope.task = "Eat the following;Burger 1;Burger 2";
        expect($scope.task).toBeDefined();
        $scope.isEnumeration = true;
        
        $scope.checkEnumeration();
    
        
        //check if all enumeration parts have been defined and contain the correct text
        //the result of the test
        expect($scope.tasklineOne).toBeDefined();
        expect($scope.tasklineOne).toEqual("Eat the following");
        
        expect($scope.enumeration[0]).toBeDefined();
        expect($scope.enumeration[0]).toEqual("Burger 1");
        
        expect($scope.enumeration[1]).toBeDefined();
        expect($scope.enumeration[1]).toEqual("Burger 2");
            
    });
    
    it("inserts the text if there is no enumeration", function() {
        //inject Scope and Controller
        var $scope = {};
        var controller = $controller('playCtrl', {$scope: $scope });
        //inputs
        $scope.task = "Dance around the nearest traffic light you can find";
        $scope.isEnumeration = false;
        
        //function of Controller
        $scope.checkEnumeration();
        
        //result of the test
        expect($scope.tasklines).toBeDefined();
        expect($scope.tasklines).toEqual("Dance around the nearest traffic light you can find");
        
    });
});
       