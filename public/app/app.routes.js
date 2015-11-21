angular.module('appRoutes', ['ngRoute'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })
            .when('/login', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'MainController',
                controllerAs: 'loginCtl'
            })
            .when('/signup', {
                templateUrl: 'app/views/pages/signup.html',
                controller: 'SignupController',
                controllerAs: 'signupCtl'
            })
            .when('/stories', {
                templateUrl: 'app/views/pages/stories.html',
                controller: 'StoryController',
                controllerAs: 'storyCtl'
            })
            .otherwise({
                redirect: '/'
            });
        $locationProvider.html5Mode(true);
    }]);