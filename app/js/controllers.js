'use strict';

/* Controllers */

function startingData(){
  		this.stage = "Band"
  		this.leader = 'Glaar'
  		this.scene = "intro"
  		this.generation = 1
  		this.population = 30
  		this.religion = 'Animism'
  	}

angular.module('myApp.controllers', [])
<<<<<<< HEAD
  .controller('GameCtrl', ['$scope', function($scope) {
  	$scope.gui = {};
  	$scope.gameData = new startingData;

	$scope.scenes = {}
	$scope.scenes.list = {
		intro: {
			message: "The mountain spews fire. The mountain spirit must be angry. Kinsman have always hunted and gathered here. They turn to you, " + $scope.gameData.leader + ", for guidance.",
			actionPrompt: "Abandon homeland or make a sacrifice to the mountain?",
			choices: [
		  		{text: "Flee", nextScene: 'firstMove'},
		  		{text: "Sacrifice", nextScene: 'sacrifice'}
		  	],
		  	script: function(){
		  		$scope.gameData = new startingData;
		  	}
		},
		firstMove: {
			message: "You lead your band away from the mountain. The mountain explodes. The band heads east, away from the ash. They stop in a valley, lush with flora and fauna.",
			actionPrompt: "Settle here or move on?",
			choices: [
		  		{text: "Settle", nextScene: 'settle'},
		  		{text: "Move on", nextScene: 'TODO'}
		  	],
		  	script: function(){
		  		$scope.gameData.population += Math.round((Math.random()-.5)*2);

		  	}
		},
		settle: {
			message: "Your people are content in their new land. Food is abundant and the weather is fair. Children are born who will never know life at the foot of the angry mountain. After several seasons you scrape your toe and die from an infection. No matter - your kinsman are wise and can thrive without you.",
			actionPrompt: "",
			choices: [
		  		{text: "", nextScene: 'TODO'},
		  		{text: "", nextScene: 'TODO'}
		  	],
		  	script: function(){
		  		$scope.gameData.population += Math.round(Math.random()*5)+2;
		  	}
		},
		sacrifice: {
			message: "You tell your kinsmen to prepare a giant pyre for the sacrifice. They start building. They gather food for a feast.",
			actionPrompt: "What shall be sacrificed?",
			choices: [
		  		{text: "Goat", nextScene: 'pyroclastic'},
		  		{text: "Chicken", nextScene: 'pyroclastic'},
		  		{text: "An Elder", nextScene: 'pyroclastic'}
		  	],
		  	script: function(){
		  	}
		},
		pyroclastic: {
			message: "The pyre illuminates the night sky. As the ceremony begins, you are engulfed by a pyroclastic flow. Your band dies a swift and painless death.",
			actionPrompt: "Game Over",
			choices: [
		  		{text: "Restart", nextScene: 'intro'}
		  	],
		  	script: function(){
		  		$scope.gameData.population = 0;
		  	}
		},
		TODO: {
			message: "",
			actionPrompt: "",
			choices: [
		  		{text: "Restart", nextScene: 'intro'},
		  		{text: "Restart", nextScene: 'intro'}
		  	],
		  	script: function(){

		  	}
		}
	};
	$scope.scenes.goToScene = function(sceneName, text) {
		$scope.gameData.scene = sceneName;
		console.log('Scene: ' + sceneName + " Text: " + text);
		$scope.gui = $scope.scenes.list[$scope.gameData.scene]
		$scope.gui.script();
	};
	$scope.gui = $scope.scenes.list[$scope.gameData.scene]
  	

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
