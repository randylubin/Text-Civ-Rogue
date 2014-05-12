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
	$scope.scenes.list = sceneModel.data.list
	

	$scope.scenes.goToScene = function(sceneName, text, interceptable, data) {
		gameDataModel.data.scene = sceneName;

		console.log('Scene: ' + sceneName + " Text: " + text);
		guiModel.data.actionPrompt = $scope.scenes.list[gameDataModel.data.scene].actionPrompt
		guiModel.data.choices = $scope.scenes.list[gameDataModel.data.scene].choices
		$scope.scenes.list[gameDataModel.data.scene].script(data);

		if ($scope.scenes.list[gameDataModel.data.scene].interceptable){
			var interceptReturn = $scope.interceptEvaluation(sceneName);
	  		if (interceptReturn.intercepted == true){
	  			guiModel.data.message += interceptReturn.message;
	  			guiModel.data.actionPrompt = interceptReturn.actionPrompt;
	  			guiModel.data.choices = interceptReturn.choices;
	  			
	  		}
		}
		alerts.data.messages();
	};

	$scope.interceptEvaluation = function(data){	

		var interceptReturn = {
			intercepted: false
		}

		// agriculture
		if ((gameDataModel.data.turnsStationary > 1) && !gameDataModel.data.agriculture){
			var compoundingOdds = 0.99;
			interceptReturn.intercepted = (Math.random() > Math.pow(compoundingOdds,gameDataModel.data.turnsStationary))
			if (interceptReturn.intercepted) {
				gameDataModel.data.agriculture = 1;
				interceptReturn.message = "<br /><br />You've discovered agriculture!"
				interceptReturn.actionPrompt = "Wheeeee!";
				interceptReturn.choices = [
			  		{text: "Restart", nextScene: 'intro', data: {}},
			  		{text: "Restart", nextScene: 'intro', data: {}}
			  	]				
			}
		}

		return interceptReturn;
	}





	guiModel.data.actionPrompt = $scope.scenes.list[gameDataModel.data.scene].actionPrompt
	guiModel.data.choices = $scope.scenes.list[gameDataModel.data.scene].choices
	$scope.scenes.list[gameDataModel.data.scene].script()

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
