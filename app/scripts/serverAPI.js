var module = angular.module('ServerAPI', [])

//Error codes:
//OneNote

//module.factory('APIServices', function ($http) {
/*const http = require('http')
const querystring = require('querystring')
const request = require('request') */

const host = 'https://whou.sabic.uberspace.de'
const port = 443
const newUserPath = '/api/newUser'
const loginWithUsernamePath = '/api/login/username'
const loginWithSessionKeyPath = '/api/login/sessionkey'
const searchPartnerToPlayWithPath = '/api/play'

module.factory('serverAPI', function ($http) {
    return {
        createNewUser: function (username, password, mail, callback) {
            var user = {
                'username': username,
                'password': password,
                'mail': mail
            }
            console.log(host + newUserPath)
            $http.post(host + newUserPath, user).success(callback)
        },
        loginWithUsername: function (mail, password, callback) {
            var user = {
                'mail': mail,
                'password': password
            }
            $http.post(host + loginWithUsernamePath, user).success(callback)
        },
        loginWithSessionKey: function (userId, sessionkey, callback) {
            var credentials = {
                '_id': userId,
                'sessionkey': sessionkey
            }
            $http.get(host + loginWithSessionKeyPath, credentials).success(callback)

        },
        searchPartnerToPlayWith: function (long, lat, userId, callback) {
            var searchRequest = {
                '_id': userId,
                'longitude': long,
                'latitude': lat
            }
            $http.post(host + searchPartnerToPlayWithPath, searchRequest).success(callback)
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