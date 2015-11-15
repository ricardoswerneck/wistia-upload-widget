var url = 'https://upload.wistia.com/?api_password=493b061307bff5cb20b9a1567ffa2e67fe19000ec266dd6e2c238f4dbb99dead';

var app = angular.module('video-upload-module', ['blueimp.fileupload']);

app.directive('ngWistiaVideoUpload', function() {
  return {
    restrict: 'E',
    templateUrl: 'upload.html'
  }
});

app.config(['$httpProvider', 'fileUploadProvider', function ($httpProvider, fileUploadProvider) {
    fileUploadProvider.defaults.progress = function(e, data) {
      if (e.isDefaultPrevented()) {
        return false;
      }
      if (!data.scope.$$phase) {
        data.scope.$apply();
      }
    };

}]);

app.controller('upload-controller', ['$scope', '$http', '$filter', '$window', function($scope, $http){

        $scope.options = {
            url: url,
            autoUpload: true,
            singleFileUploads: true,
            sequentialUploads: false,
            maxFileSize: 50000000,
            acceptFileTypes: /(\.|\/)(mp4|3gp|avi|mpg|mpeg|mkv|mov)$/i
        };

        $scope.loadingFiles = true;


        $scope.submit = function() {

        };

       $scope.$on('fileuploadfail', function(e, data){
            console.log('Upload fail');
       });

       $scope.$on('fileuploaddone', function(e, data){
            console.log('file upload done');

            var result = $.grep(e.targetScope.queue, function(x){ return x.name == data.result.name; });

            if(result.length > 0){
                for (var item in result) {
                    if(!result[item].hashedId){
                         result[item].hashedId = data.result.hashed_id;
                         result[item].error = "Video uploaded successfully";
                    }
                }
            }
       });

        $scope.$on('fileuploadstop', function(){
            console.log('All uploads have finished');
        });
}]);

app.controller('FileDestroyController', ['$scope', '$http', function ($scope, $http) {
        var file = $scope.file,
            state;

        file.$openVideoModal = function(){
                $('#wistiaDiv').empty();
                $('#wistiaDiv').html('<div id="wistiaPlayer" class="wistia_embed wistia_async_' + file.hashedId + '" style="width: 570px; height: 400px;"">&nbsp;</div><script charset="ISO-8859-1" src="https://fast.wistia.com/assets/external/E-v1.js" async></script>');
                $('#myModal').modal('show');
        }

        file.$state = function () {
            return state;
        };

        file.$destroy = function () {
            state = 'pending';
            $scope.clear(file);
        };

        file.$cancel = function () {
            $scope.clear(file);
        };
    }
]);