angular.module('feedback', ['serverAPI'])

.controller('feedbackCtrl', function ($scope, $state, cssInjector, serverAPI) {

    cssInjector.add('styles/feedback.css');

    //Counter for counting in array with not yet rated games
    $scope.counter = 0;
    var stayInTouch = 'true';
    var sendStayInTouch = 1;

    $scope.UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

    $scope.showChoice = true;
    $scope.question1;
    $scope.question2 = 0;
    $scope.question3 = 0;
    $scope.buttonDisabled=true;
    $scope.submitButtonText='Submit rating';

    $scope.openGames = [];
    serverAPI.getGamesToRate($scope.UID, function (data) {
        
        if(data == -10){
            $state.go('tab.home');
        }else{
            for (var i = 0; i < data.length; i++) {
                $scope.openGames[i] = data[i];
            }

            $scope.severalFeedbacks;
            $scope.singleFeedback;
            $scope.notRatedGames=$scope.openGames.length;

            if($scope.notRatedGames==1){
                $scope.singleFeedback=true;
                $scope.severalFeedbacks=false;
            }else if($scope.notRatedGames>1){
                $scope.singleFeedback=false;
                $scope.severalFeedbacks=true;
            }

            serverAPI.getUserData($scope.openGames[$scope.counter].otherPlayerId, function (data) {
                if(data==-4){
                    $scope.notContacted();
                }else{
                    $scope.ratedName = data.userName;
                }
            });
        }
    });
    

    if (stayInTouch == 'true') {
        $scope.userChoiceContact = {
            mode: true
        };
    } else {
        $scope.userChoiceContact = {
            mode: false
        };
    }

    $scope.starsQuestion2 = [
        {
            id: 0,
            action: 'rateQuestion2(1)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 1,
            action: 'rateQuestion2(2)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 2,
            action: 'rateQuestion2(3)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 3,
            action: 'rateQuestion2(4)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 4,
            action: 'rateQuestion2(5)',
            icon: 'ion-ios-star-outline'
       }]

    $scope.starsQuestion3 = [
        {
            id: 0,
            action: 'rateQuestion3(1)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 1,
            action: 'rateQuestion3(2)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 2,
            action: 'rateQuestion3(3)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 3,
            action: 'rateQuestion3(4)',
            icon: 'ion-ios-star-outline'
       }, {
            id: 4,
            action: 'rateQuestion3(5)',
            icon: 'ion-ios-star-outline'
       }]

    $scope.contacted = function () {
        $scope.showChoice = false;
        $scope.showForm = true;
        $scope.question1 = true;
    }

    $scope.rateQuestion2 = function (x) {
        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            $scope.starsQuestion2[i].icon = 'ion-ios-star-outline';
        }

        $scope.question2 = x;
        var selected = x - 1;

        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            if ($scope.starsQuestion2[i].id <= selected) {
                $scope.starsQuestion2[i].icon = 'ion-ios-star';
            }
        }
    }

    $scope.rateQuestion3 = function (x) {
        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            $scope.starsQuestion3[i].icon = 'ion-ios-star-outline';
        }

        $scope.question3 = x;
        var selected = x - 1;

        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            if ($scope.starsQuestion3[i].id <= selected) {
                $scope.starsQuestion3[i].icon = 'ion-ios-star'
            }
        }
    }

    $scope.enableSubmit = function (x) {
        if(x==0){    
            if ($scope.question2 == 0 || $scope.question3 == 0) {
                return true;
            }
        }else if(x==1){
            return true;
        }else if(x==2){
            return false;
        }
    }

    $scope.changeUserChoiceContact = function () {
        if (stayInTouch == 'true') {
            stayInTouch = 'false';
        } else if (stayInTouch == 'false') {
            stayInTouch = 'true';
        }
    }

    $scope.evaluate = function () {
        var scoreQuestion1 = 5;
        var scoreQuestion2 = parseInt($scope.question2);
        var scoreQuestion3 = parseInt($scope.question3);
        var finalScore = scoreQuestion1 + scoreQuestion2 + scoreQuestion3;
        $scope.submitButtonText='Processing';
        $scope.enableSubmit(1);
        $scope.showForm=false;

        if (stayInTouch == 'true') {
            sendStayInTouch = 1;
        } else if (stayInTouch == 'false') {
            sendStayInTouch = 0;
        }

        //stayInTouch=1: keep contact; stayInTouch=0: no further contact
        serverAPI.insertNewRating($scope.openGames[$scope.counter].otherPlayerId, finalScore, $scope.openGames[$scope.counter].gameId, sendStayInTouch, function (data) {
            console.error('Insert new rating: ' + data);

            $scope.counter++;
            if ($scope.counter < $scope.openGames.length) {
                
                $scope.showChoice = 'true';
        
                serverAPI.getUserData($scope.openGames[$scope.counter].otherPlayerId, function (data) {
                    if(data==-4){
                        $scope.notContacted();
                    }else{
                        $scope.ratedName = data.userName;
                    }   
                });
                
                $scope.submitButtonText='Submit rating';
                $scope.enableSubmit(2);
                
                for (var i = 0; i < $scope.starsQuestion2.length; i++) {
                    $scope.starsQuestion2[i].icon = 'ion-ios-star-outline';
                }
                
                for (var i = 0; i < $scope.starsQuestion3.length; i++) {
                    $scope.starsQuestion3[i].icon = 'ion-ios-star-outline';
                }
                
            } else {
                window.location = "#/tab/home";
            }
        });
        
        
    }

    $scope.notContacted = function () {
        //stayInTouch=1: keep contact; stayInTouch=0: no further contact
        serverAPI.insertNewRating($scope.openGames[$scope.counter].otherPlayerId, 0, $scope.openGames[$scope.counter].gameId, 0, function (data) {
            console.error('No Contact, Score=0: ' + data);

            $scope.counter++;
            if ($scope.counter < $scope.openGames.length) {
                
                $scope.showChoice = 'true';
        
                serverAPI.getUserData($scope.openGames[$scope.counter].otherPlayerId, function (data) {
                    if(data==-4){
                        $scope.notContacted();
                    }else{
                        $scope.ratedName = data.userName;
                    }   
                });
                
                $scope.submitButtonText='Submit rating';
                $scope.enableSubmit(2);
                
                for (var i = 0; i < $scope.starsQuestion2.length; i++) {
                    $scope.starsQuestion2[i].icon = 'ion-ios-star-outline';
                }
                
                for (var i = 0; i < $scope.starsQuestion3.length; i++) {
                    $scope.starsQuestion3[i].icon = 'ion-ios-star-outline';
                }
                
            } else {
                window.location = "#/tab/home";
            }
        });
    }
})