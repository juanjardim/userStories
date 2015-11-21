angular.module('mainCtl', [])
    .controller('MainController', ['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
        var vm = this;
        vm.loggedIn = Auth.isLogged();
        vm.loginData = {
            username: '',
            password: ''
        };

        $rootScope.$on('$routeChangeStart', function () {
            vm.loggedIn = Auth.isLogged();
            Auth.getUser()
                .then(function (data) {
                    vm.user = data.data;
                });
            if(vm.loggedIn){
                $location.path('/stories');
            }
        });

        vm.doLogin = function () {
            vm.processing = true;
            vm.hasError = false;
            vm.error = '';
            Auth.login(vm.loginData.username, vm.loginData.password)
                .then (function (res) {
                    var data = res.data;
                    vm.processing = false;
                    Auth.getUser()
                        .then(function (data) {
                            vm.user = data.data;
                        });
                    if (data.success) {
                        $location.path('/stories');
                    } else {
                        vm.hasError = true;
                        vm.error = data.message;
                    }
                }, function(data){
                    vm.hasError = true;
                    vm.error = data.message;
                    vm.processing = false;
                });
        };

        vm.doLogout = function () {
            Auth.logout();
            vm.loggedIn = false;
            vm.loginData = {
                username: '',
                password: ''
            };
            $location.path('/');
        }
    }]);