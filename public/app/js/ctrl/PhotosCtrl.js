"use strict";
angular.module('cupidog')

.controller('PhotosCtrl', ['$scope', 'Upload', '$timeout', 'SessionSrv', function ($scope, Upload, $timeout, SessionSrv) {

	function getPhotos(){
		SessionSrv.findPhotos().then(function(photos){
			photos.forEach(function(photo){
				photo.src = "https://s3-eu-west-1.amazonaws.com/www.qpidog.es/" + photo.path;
			})
			$scope.photos = photos;
		});
	}
	getPhotos();

	$scope.$watch('files', function () {
		$scope.upload($scope.files);
	});
	
	$scope.$watch('file', function () {
		if ($scope.file != null) {
			$scope.upload([$scope.file]);
		}
	});
	
	$scope.log = '';

	$scope.pet = SessionSrv.getPet();
	var petId = $scope.pet._id;
	var userId = SessionSrv._getUser()._id;

	$scope.upload = function (files) {
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				Upload.upload({
					method: 'POST',
					url: "/api/pets/" + petId + "/photos/",//'https://angular-file-upload-cors-srv.appspot.com/upload',
					fields: {
						'petId': petId,
						'userId': userId,
					},
					file: file,
					sendFieldsAs: 'json-blob', //json|json-blob|form,
				}).progress(function (evt) {

					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					$scope.log =	'progress: ' +
									progressPercentage + '% ' +
									evt.config.file.name + '\n' +
									$scope.log;

				}).success(function (data, status, headers, config) {
					$timeout(function() {
						$scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
					});
					getPhotos();

				}).error(function(data, status, headers, config) {
					console.error("Error %s: %o", status, data);// handle error
				}).xhr(function(xhr){
					//access or attach event listeners to the underlying XMLHttpRequest
					//xhr.upload.addEventListener(...) 
				});
			}
		}
	};

	$scope.setProfilePic = function(){
		SessionSrv.updatePet($scope.pet);
	}

}]);

/*.directive('fileInput', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function($scope, elm, attrs){
			elm.bind('change', function(changeEvent){
				$parse(attrs.fileInput)
				.assign($scope, elm[0].files);
				$scope.$apply();
			});
		}
	};
}])

.controller('PhotosCtrl', ['$scope', '$http', 'SessionSrv', function($scope, $http, SessionSrv){

	window.$scope = $scope;

	$scope.filesChanged = function(elm){
		/*$scope.files = elm.files;
		$scope.$apply();*
		console.log("changed!!!");
	};

	$scope.uploadPhotos = function(){
		console.log("uploading %o !!!", $scope.files);

		var fd = new FormData();

		angular.forEach($scope.files, function(file){
			fd.append('file', file);
		});

		SessionSrv.postPhotos(fd);

		
	};


}]);*/


	