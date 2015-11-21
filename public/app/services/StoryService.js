angular.module('storyService', [])
.factory('Story', ['$http', function($http){
    var storyFactory = {};
    storyFactory.all = function() {
        return $http.get('/api/stories');
    };

    storyFactory.create = function(story){
        return $http.post('/api/stories', story);
    };
    return storyFactory;
}]);