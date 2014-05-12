'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize'])
  .controller('GameCtrl', ['$scope', 'utils', 'gameDataModel', 'sceneModel', 'guiModel', 'alerts', function($scope, utils, gameDataModel, sceneModel, guiModel, alerts) {
  	$scope.guiModel = guiModel;
  	$scope.gameDataModel = gameDataModel;
  	gameDataModel.data.reset();
  	gameDataModel.data.land = utils.randomLandDescription();

  	$scope.alerts = alerts;
  	alerts.data.reset();


	$scope.scenes = {}
	$scope.scenes.list = sceneModel.data.list;
	$scope.scenes.goToScene = sceneModel.data.goToScene;


	guiModel.data.actionPrompt = $scope.scenes.list[gameDataModel.data.scene].actionPrompt
	guiModel.data.choices = $scope.scenes.list[gameDataModel.data.scene].choices
	$scope.scenes.list[gameDataModel.data.scene].script()

  }])
