angular.module('run.controller', [])

.controller('RunController', function($scope, $timeout, $location, Geo){
  $scope.raceStarted = 0;
  $scope.startTime;
  $scope.userLocation;
  $scope.destination;

  var tick = function() {
    $scope.time = Math.floor((Date.now() - $scope.startTime)/1000);
    $timeout(tick, 100)
  }

  $scope.startRun = function() {
    $scope.startTime = Date.now();
    $scope.raceStarted = true;
    tick();
  }

  // $scope.getCurrentCoords = function() {
  //   console.log('ran');
  //   Geo.getCurrentCoords(function(coordsObj) {
  //     $scope.currentCoords = coordsObj;
  //     console.log('$scope.currentCoords.lat: ', $scope.currentCoords.lat);
  //     console.log('$scope.currentCoords.lng: ', $scope.currentCoords.lng);
  //   });
  // };

  $scope.makeInitialMap = function($scope) {
    Geo.makeInitialMap($scope);
  };

  $scope.makeInitialMap($scope);

  $scope.updateCurrentPosition = function($scope, $location) {
    Geo.updateCurrentPosition($scope);
    $scope.checkIfFinished($location);
  };

  $scope.checkIfFinished = function($location) {
    if ($scope.destination && $scope.userLocation) {
      var currLat = $scope.userLocation.lat;
      var currLng = $scope.userLocation.lng;
      var destLat = $scope.destination.lat;
      var destLng = $scope.destination.lng;
      var distRemaining = Math.sqrt(Math.pow((currLat - destLat), 2) + Math.pow((currLng - destLng) , 2));

      if (distRemaining < 0.0004) {
        $location.path('/finish');
        clearInterval($scope.geoUpdater);
      }
    }
  }

  // Determine user location and update map each second

  $scope.geoUpdater = setInterval(function() {$scope.updateCurrentPosition($scope, $location)}, 1000);

  // Stop geotracker upon canceling run
  $scope.stopGeoUpdater = function() {
    clearInterval($scope.geoUpdater);
  };
})
