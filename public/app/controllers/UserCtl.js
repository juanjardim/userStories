angular.module('userCtl', ['userService'])
.controller('UserController', ['User', function(User){
    var vm = this;
    User.all()
        .success(function(data){
            vm.users = data.users;
        });
}])

.controller('SignupController', ['User', '$location', function(User, $location){
    var vm = this;
    vm.userData = {};

    vm.signupUser = function() {
        vm.processing = true;
        vm.message = '';
        User.signup(vm.userData)
            .then(function(res) {
                vm.processing = false;
                vm.userData = {};
                vm.message = res.data.message;
                $location.path('/');
            });
    };
}]);