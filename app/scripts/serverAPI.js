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
const skipUserPath = '/benefit/skipUser'
const userDataPath = '/userData/data'
const recentEventsPath = '/userData/recentEvents'
const changeModusPath = '/userData/changeModus'
const updateGPSPath = '/userData/updateGPS'
const insertPushIdPath = '/userData/pushId'
const newPhotoPath = '/photo/saveNew'
const getPhotoPath = '/photo/get'
const updateProfilPhotoPath = '/photo/profilPhoto'
const deletePhotoPath = '/photo/delete'
const logOutPath = '/logout'
const usersCurrentlyPlayedWithPath = '/chat/list'
const previousMessagesPath = '/chat/previousMessages'
const messagesLeftPath = '/chat/messagesLeftPath'
const upgradeMessagesPath = '/chat/upgradeMessages'
const sendMessagePath = '/chat/sendMessage'
const searchStartedPushPath = '/chat/searchStartedPush'
const sendStandardMessagePath = '/chat/sendStandardMessage'
const openSSEConnectionPath = '/chat/openSSEConnection'


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
            $http.post(host + newUserPath, user).success(callback).error(function (err) {
                console.log(err)
            })

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
            }).success(callback).error(function (err) {
                console.log(err)
            })
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
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        searchPartnerToPlayWith: function (long, lat, userId, callback) {
            console.log('called')
            var searchRequest = {
                '_id': userId,
                'longitude': long,
                'latitude': lat
            }
            $http.post(host + searchPartnerToPlayWithPath, searchRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getGamesToRate: function (userId, callback) {
            var gamesToRateRequest = {
                _id: userId
            }
            $http({
                url: host + gamesToRatePath,
                method: 'GET',
                params: gamesToRateRequest
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        insertNewRating: function (userId, coinsToAdd, gameId, stayInContact, callback) {
            var coinAddRequest = {
                _id: userId,
                coins: coinsToAdd,
                gameId: gameId,
                stayInContact: stayInContact
            }
            $http.put(host + insertNewRatingPath, coinAddRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getAllBenefitItems: function (callback) {
            $http({
                url: host + allItemsPath,
                method: 'GET',
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        buyItem: function (userId, benefitId, count, callback) {
            var buyRequest = {
                '_id': userId,
                'BID': benefitId,
                'count': count
            }
            $http.post(host + buyItemPath, buyRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getUserData: function (userId, callback) {
            var userId = {
                '_id': userId
            }
            $http({
                url: host + userDataPath,
                method: 'GET',
                params: userId
            }).success(callback).error(function (err) {
                console.log(err)
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
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        changeModus: function (userId, newModus, callback) {
            //newModus: 1 visible, 0 invisible
            var changeModusRequest = {
                '_id': userId,
                'newModus': newModus
            }
            $http.put(host + changeModusPath, changeModusRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        updateGPS: function (userId, longitude, latitude, callback) {
            var userLocationData = {
                '_id': userId,
                'longitude': longitude,
                'latitude': latitude
            }
            $http.put(host + updateGPSPath, userLocationData).success(callback).error(function (err) {
                console.log(err)
            })
        },
        insertPushId: function (userId, pushId, callback) {
            var insertPushIdRequest = {
                '_id': userId,
                'pushId': pushId
            }
            $http.put(host + insertPushIdPath, insertPushIdRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        saveNewPhoto: function (userId, photoString, callback) {
            var photoData = {
                '_id': userId,
                'photoString': photoString,
            }
            $http.post(host + newPhotoPath, photoData).success(callback).error(function (err) {
                console.log(err)
            })
        },
        deletePhoto: function (userId, photoId, callback) {
            var deletePhotoRequest = {
                '_id': userId,
                'PID': photoId
            }
            console.log(deletePhotoRequest)
            $http.post(host + deletePhotoPath, deletePhotoRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        updateProfilPhoto: function (userId, photoId, callback) {
            var changeProfilPhotoRequest = {
                '_id': userId,
                'photoId': photoId
            }
            $http.put(host + updateProfilPhotoPath, changeProfilPhotoRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        logout: function (userId, callback) {
            var logoutRequest = {
                '_id': userId
            }
            $http.put(host + logOutPath, logoutRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        testMehtode: function () {
            $http.get('https://whou.sabic.uberspace.de/api/newUser').success(function (data, status, headers, config) {
                console.log(data)
            }).error(function (err) {
                console.log(err)
            })
        },
        getPhoto: function (userId, photoId, callback) {
            var photoRequest = {
                '_id': userId,
                'photoId': photoId
            }
            $http({
                url: host + getPhotoPath,
                method: 'GET',
                params: photoRequest
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getUsersCurrentlyPlayedWith: function (userId, callback) {
            var user = {
                '_id': userId,
            }
            console.log(user)
            $http({
                url: host + usersCurrentlyPlayedWithPath,
                method: 'GET',
                params: user
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        pushSearchStarted: function (userId, callback) {
            var user = {
                '_id': userId
            }
            $http.post(host + searchStartedPushPath, user).success(callback).error(function (err) {
                console.log(err)
            })
        },
        pushStandardMessage: function (userId, callback) {
            var user = {
                '_id': userId
            }
            $http.post(host + sendStandardMessagePath, user).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getPreviousMessages: function (userId, otherUserId, callback) {
            var previousMessageRequest = {
                '_id': userId,
                'otherUser': otherUserId
            }
            $http({
                url: host + previousMessagesPath,
                method: 'GET',
                params: previousMessageRequest
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        sendMessage: function (userId, otherUserId, message, timeStamp, callback) {
            var messageRequest = {
                '_id': userId,
                'otherUser': otherUserId,
                'message': message,
                'timeStamp': timeStamp
            }
            $http.post(host + sendMessagePath, messageRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        getMessagesLeft: function (userId, otherUserId, callback) {
            var messagesLeftRequest = {
                '_id': userId,
                'otherUser': otherUserId,
            }
            $http({
                url: host + messagesLeftPath,
                method: 'GET',
                params: messagesLeftRequest
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        upgradeMessagesLeftCount: function (userId, otherUserId, callback) {
            var upgradeMessagesRequest = {
                '_id': userId,
                'otherUser': otherUserId
            }
            $http.put(host + upgradeMessagesPath, upgradeMessagesRequest).success(callback).error(function (err) {
                console.log(err)
            })
        },
        establishSSEConnection: function (userId, callback) {
            var user = {
                '_id': userId
            }
            $http({
                url: host + openSSEConnectionPath,
                method: 'GET',
                params: user
            }).success(callback).error(function (err) {
                console.log(err)
            })
        },
        skipUser: function (userId, gameId, callback) {
            var skipUserRequest = {
                '_id': userId,
                'gameId': gameId
            }
            $http.put(host + skipUserPath, skipUserRequest).success(callback).error(function (err) {
                console.log(err)
            })
        }
    }
})