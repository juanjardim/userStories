angular.module('storyClt', ['storyService'])
    .controller('StoryController', ['Story', function (Story) {
        var vm = this;
        vm.creatingNewStory = false;
        Story.all()
            .success(function (data) {
                vm.stories = data.stories;
            });
        vm.createStory = function () {
            vm.processing = '';
            vm.message = '';
            Story.create(vm.storyData)
                .success(function (data) {
                    vm.processing = '';
                    vm.message = data.message;
                    vm.creatingNewStory = false;
                    vm.stories = data.stories;
                });
        };
        vm.showNewStoryForm = function() {
            vm.storyData = {};
            vm.creatingNewStory = true;
        };
        vm.hideNewStoryForm = function(){
            vm.storyData = {};
            vm.creatingNewStory = false;
        };

    }]);