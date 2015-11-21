angular.module('userService', [])
.factory('User', ['$http', 'AuthToken', function($http, AuthToken){
    var userFactory = {};
    userFactory.signup = function(userData) {
        return $http.post('/api/signup', userData)
            .success(function(data){
                AuthToken.setToken(data.token);
                return data;
            });
    };

    userFactory.all = function() {
        return $http.get('/api/users');
    };

    return userFactory;
}]);