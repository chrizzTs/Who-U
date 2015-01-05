var module = angular.module('serverAPI', [])

//Error codes:
//OneNote

//module.factory('APIServices', function ($http) {
/*const http = require('http')
const querystring = require('querystring')
const request = require('request') */

const host = 'https://whou.sabic.uberspace.de/api'
const port = 443
const newUserPath = '/newUser'
const loginWithMailPath = '/login/mail/'
const loginWithSessionKeyPath = '/login/sessionkey'
const searchPartnerToPlayWithPath = '/play'
const gamesToRatePath = '/play/rating/gamesToRate'
const insertNewRatingPath = '/play/rating/insertNewRating'
const allItemsPath = '/benefit/allItems'
const buyItemPath = '/benefit/buyItem'
const userDataPath = '/userData/data'
const recentEventsPath = '/userData/recentEvents'
const changeModusPath = '/userData/changeModus'
const updateGPSPath = '/userData/updateGPS'
const newPhotoPath = '/photo/saveNew'
const deletePhotoPath = 'photo/delete'
const logOutPath = '/logout'


module.factory('serverAPI', function ($http) {
    return {
        createNewUser: function (username, password, mail, longitude, latitude, callback) {
            var user = {
                'username': username,
                'password': password,
                'mail': mail,
                'longitude': longitude,
                'latitude': latitude
            }

            $http.post(host + newUserPath, user).success(callback)

        },
        loginWithMail: function (mail, password, callback) {
            var user = {
                'mail': mail,
                'password': password
            }
            $http({
                url: host + loginWithMailPath,
                method: 'GET',
                params: user
            }).success(callback)
        },
        loginWithSessionKey: function (userId, sessionkey, callback) {
            var credentials = {
                '_id': userId,
                'sessionkey': sessionkey
            }
            $http({
                url: host + loginWithSessionKeyPath,
                method: "GET",
                params: credentials
            }).success(callback)
        },
        searchPartnerToPlayWith: function (long, lat, userId, callback) {
            var searchRequest = {
                '_id': userId,
                'longitude': long,
                'latitude': lat
            }
            $http.post(host + searchPartnerToPlayWithPath, searchRequest).success(callback)
        },
        getGamesToRate: function (userId, callback) {
            var gamesToRateRequest = {
                _id: userId
            }
            $http({
                url: host + gamesToRatePath,
                method: 'GET',
                params: gamesToRateRequest
            }).success(callback)
        },
        insertNewRating: function (userId, coinsToAdd, callback) {
            var coinAddRequest = {
                _id: userId,
                coins: coinsToAdd
            }
            $http.put(host + insertNewRatingPath, coinAddRequest).success(callback)
        },
        getAllBenefitItems: function (callback) {
            $http({
                url: host + allItemsPath,
                method: 'GET',
            }).success(callback)
        },
        buyItem: function (userId, benefitId, count, callback) {
            var buyRequest = {
                '_id': userId,
                'BID': benefitId,
                'count': count
            }
            $http.post(host + buyItemPath, buyRequest).success(callback)
        },
        getUserData: function (userId, callback) {
            var userId = {
                '_id': userId
            }
            $http({
                url: host + userDataPath,
                method: 'GET',
                params: userId
            }).success(callback).error(function (data, status, headers, config) {
                console.log(data)
            })
        },
        getRecentEvents: function (userId, callback) {
            var userId = {
                '_id': userId
            }
            $http({
                url: host + recentEventsPath,
                method: 'GET',
                params: userId
            }).success(callback)
        },
        changeModus: function (userId, newModus, callback) {
            //newModus: 1 visible, 0 invisible
            var changeModusRequest = {
                '_id': userId,
                'newModus': newModus
            }
            $http.put(host + changeModusPath, changeModusRequest).success(callback)
        },
        updateGPS: function (userId, longitude, latitude, callback) {
            var userLocationData = {
                '_id': userId,
                'longitude': longitude,
                'latitude': latitude
            }
            $http.put(host + updateGPSPath, userLocationData).success(callback)
        },
        saveNewPhoto: function (userId, photoString, callback) {
            var photoData = {
                '_id': userId,
                'photoString': photoString,
            }
            $http.post(host + newPhotoPath, photoData).success(callback)
        },
        deletePhoto: function (userId, photoId, callback) {
            var deletePhotoRequest = {
                '_id': userId,
                'PID': photoId
            }
            $http({
                path: host + deletePhotoPath,
                method: 'DELETE',
                params: deletePhotoRequest
            }).success(callback)
        },
        logout: function (userId, callback) {
            var logoutRequest = {
                '_id': userId
            }
            $http.put(host + logOutPath, logoutRequest).success(callback)
        },
        testMehtode: function () {
            $http.get('https://whou.sabic.uberspace.de/api/newUser').success(function (data, status, headers, config) {
                console.log(data)
            }).error(function (data, status, headers, config) {
                console.log("Error:" + data)
            })
        }

    }
})