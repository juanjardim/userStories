angular.module('authService', [])
    .factory('Auth', ["$http", "$q", "AuthToken", function ($http, $q, AuthToken) {
        var authFactory = {};

        authFactory.login = function (username, password) {
            return $http.post('/api/login', {
                username: username,
                password: password
            }). success(function (data) {
                AuthToken.setToken(data.token);
                return data;
            });
        };

        authFactory.logout = function () {
            AuthToken.setToken();
        };

        authFactory.isLogged = function () {
            return AuthToken.getToken() != undefined;
        };

        authFactory.getUser = function () {
            var token = AuthToken.getToken();
            if (token) {
                return $http.get('/api/me');
            } else
                return $q.reject({message: "User has no token"});
        };
        return authFactory;
    }])

    .factory('AuthToken', ['$window', function ($window) {
        var authTokenFactory = {};

        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('userStoryToken');
        };

        authTokenFactory.setToken = function (token) {
            if (token)
                $window.localStorage.setItem('userStoryToken', token);
            else
                $window.localStorage.removeItem('userStoryToken');
        };

        return authTokenFactory;

    }])

    .factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function ($q, $location, AuthToken) {
        var interceptorFactory = {};

        interceptorFactory.request = function(config) {
            var token = AuthToken.getToken();
            if(token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        };

        interceptorFactory.responseError = function(res){
            if(res.status == 403){
                $location.path('/login');
                return $q.reject(res);
            }
            return res;
        };

        return interceptorFactory;
    }]);