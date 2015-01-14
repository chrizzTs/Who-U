'use strict';

angular.module('play', [])

.controller('playCtrl', ['$scope', 'cssInjector', 'serverAPI',
    function($scope, cssInjector, serverAPI) {


      cssInjector.add('styles/play.css');

      $scope.skipUser = false;

      // $scope.skipUser = window.localStorage.getItem('skipUser');

      $scope.task;
      //fetch all data from localStorage from tab-home
      $scope.fetchDataFromLocalStorage = function() {

        //$scope.teammatePhotos{}

        $scope.name = window.localStorage.getItem('teammate');

        $scope.isEnumeration = window.localStorage.getItem('isEnumeration');

        $scope.task = window.localStorage.getItem('task');
      };

      $scope.slides = new Array();

      serverAPI.getUserData(window.localStorage.getItem('teammateUID'), function(data) {
          $scope.photoIds = window.localStorage.getItem('photoIds');

          $scope.photoIds = data.photoIds;

          //loop for getting the image data of every photo
          for (var i = 0; i < $scope.photoIds.length; i++) {

            serverAPI.getPhoto(window.localStorage.getItem('teammateUID'), $scope.photoIds[i], function(data) {

              $scope.imageJson = data;

              //array of JSONs with the photoId and data is pushed into localStorage
              var entry = {
                "photoId": $scope.imageJson.id,
                "image": $scope.imageJson.data
              };

              $scope.slides.push(entry);
            })
          }
        })
        /*

    $scope.slides = [{
        image: 'img/picture_1.jpg',
      }, {
        image: 'img/picture_2.jpg',
      }

    ];
*/


        //check if task is a enumeration and split it if is

        $scope.checkEnumeration = function() {
          if ($scope.isEnumeration == 0) {
            $scope.tasklines = $scope.task;

          } else if ($scope.isEnumeration == 1) {
            var index = $scope.task.indexOf(';');
            $scope.tasklineOne = $scope.task.slice(0, index);
            var enumerationLines = $scope.task.slice(index + 1, $scope.task.length);
            $scope.enumeration = enumerationLines.split(';');
          }

        };

        //executeFunctions
        $scope.fetchDataFromLocalStorage(); $scope.checkEnumeration();


      }
      ])

  ;
