angular.module('UserStoryApp', ['mainCtl', 'authService', 'appRoutes', 'userCtl', 'storyClt', 'userService', 'storyService'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });