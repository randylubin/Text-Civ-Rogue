'use strict';

/* Controllers */

function startingData(){
	this.stage = "Band"
	this.leader = 'Glaar'
	this.scene = "intro"
	this.generation = 1
	this.population = 30
	this.religion = 'Animism'
	this.government = 'Egalitarianism'
	this.agriculture = 0
	this.turnsStationary = 0
	this.carryingCapacity = 100
}

function startingAlerts(){
	this.sacrifices = 0;
}

angular.module('myApp.controllers', ['ngSanitize'])
  .controller('GameCtrl', ['$scope', 'utils', 'gameData', function($scope, utils, gameData) {
  	$scope.gui = {};
  	$scope.gameData = gameData;
  	$scope.gameData = new startingData;
  	$scope.gameData.land = utils.randomLandDescription();

  	$scope.alerts = {};
  	$scope.alerts.alertData = new startingAlerts();

  	$scope.alerts.messages = function(){
		if ($scope.alerts.alertData.sacrifices >= 2){
			alert("It's a volcano... no amount of sacrifice will save you.");
			$scope.alerts.alertData.sacrifices = 0;
		}
	};

	$scope.scenes = {}
	$scope.scenes.list = {
		intro: {
			actionPrompt: "Abandon homeland or make a sacrifice to the mountain?",
			choices: [
		  		{text: "Flee", nextScene: 'flee', data: {}},
		  		{text: "Sacrifice", nextScene: 'sacrifice', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gui.message = "The mountain spews fire. The mountain spirit must be angry. Kinsman have always hunted and gathered here. They turn to you, " + $scope.gameData.leader + ", for guidance."
		  		$scope.gameData = new startingData;
		  	},
		  	interceptable: false
		},
		flee: {
			message: "You lead your band away from the mountain. The mountain explodes. The band heads east, away from the ash. They stop in a valley, lush with flora and fauna.",
			actionPrompt: "Settle here or move on?",
			choices: [
		  		{text: "Settle", nextScene: 'firstSettle', data: {}},
		  		{text: "Move on", nextScene: 'firstMove', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.population += Math.round((Math.random()-.5)*2);
		  		$scope.gui.message = this.message;
		  	},
		  	interceptable: false
		},
		firstMove: {
			message: "", // done in script
			actionPrompt: "Settle here or move on?",
			choices: [
		  		{text: "Settle", nextScene: 'firstSettle', data: {}},
		  		{text: "Move on", nextScene: 'firstMove', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.land = utils.randomLandDescription();
		  		$scope.scenes.list.firstMove.message =  "Your band moves onward, foraging as you go. You reach a "+ $scope.gameData.land +".";
		  		$scope.gameData.population += Math.round((Math.random()-.5)*3);
		  		$scope.gameData.turnsStationary = 0;
		  		$scope.gui.message = this.message;
		  	},
		  	interceptable: false
		},
		move: {
			message: "", //done in script
			actionPrompt: "Settle here or move on?",
			choices: [
		  		{text: "Settle", nextScene: 'stayAndGrow', data: {}},
		  		{text: "Move on", nextScene: 'move', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.land = utils.randomLandDescription();
		  		$scope.scenes.list.move.message =  "Your band moves onward, foraging as you go. You reach a "+ $scope.gameData.land +".";
		  		$scope.gameData.population += Math.round((Math.random()-.5)*3);
		  		$scope.gameData.turnsStationary = 0;
		  		$scope.gui.message = this.message;

		  	},
		  	interceptable: false
		},
		firstSettle: {
			message: "Your people are content in their new land. Food is abundant and the weather is fair. Children are born who will never know life at the foot of the angry mountain. After several seasons you scrape your toe and die from an infection. No matter - your kinsman are wise and can thrive without you.",
			actionPrompt: "Your band lives on - with the right leadership, it can thrive.",
			choices: [
		  		{text: "Stay in the "+ $scope.gameData.land, nextScene: 'stayAndGrow', data: {}},
		  		{text: "Move on", nextScene: 'move', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.population += Math.round(Math.random()*5)+2;
		  		$scope.gameData.generation += 1;
		  		$scope.gameData.turnsStationary = 1;
		  		$scope.gui.message = this.message;
		  	},
		  	interceptable: false
		},
		stayAndGrow: {
			message: "The "+ $scope.gameData.land +" becomes home. One of your key concerns is population growth.",
			actionPrompt: "What does the future hold for your band?",
			choices: utils.growthChoices,
		  	script: function(data){
		  		$scope.gameData.turnsStationary = 1;
		  		$scope.gui.message = this.message;
		  	},
		  	interceptable: false
		},
		growth: {
			message: "",
			actionPrompt: "",
			choices: utils.growthChoices,
		  	script: function(data){
		  		$scope.gameData.generation += 1;
		  		$scope.gameData.turnsStationary += 1;
		  		var growthReturn = $scope.growthProcessing(data, $scope.gameData.population, $scope.gameData.carryingCapacity)
		  		this.message = growthReturn.message;
		  		this.actionPrompt = growthReturn.actionPrompt;
		  		this.choices = growthReturn.choices;


		  		$scope.gui.message = this.message;
		  		$scope.gui.actionPrompt = this.actionPrompt
		  	},
		  	interceptable: true
		},
		sacrifice: {
			message: "You tell your kinsmen to prepare a giant pyre for the sacrifice. They start building. They gather food for a feast.",
			actionPrompt: "What shall be sacrificed?",
			choices: [
		  		{text: "Goat", nextScene: 'pyroclastic', data: {}},
		  		{text: "Chicken", nextScene: 'pyroclastic', data: {}},
		  		{text: "An Elder", nextScene: 'pyroclastic', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gui.message = this.message;

		  	},
		  	interceptable: false
		},
		pyroclastic: {
			message: "The pyre illuminates the night sky. As the ceremony begins, you are engulfed by a pyroclastic flow. Your band dies a swift and painless death.",
			actionPrompt: "Game Over",
			choices: [
		  		{text: "Restart", nextScene: 'intro', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.population = 0;
		  		$scope.alerts.alertData.sacrifices += 1;
		  		$scope.gui.message = this.message;
		  	},
		  	interceptable: false
		},
		TODO: {
			message: "",
			actionPrompt: "",
			choices: [
		  		{text: "Restart", nextScene: 'intro', data: {}},
		  		{text: "Restart", nextScene: 'intro', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gui.message = this.message;

		  	},
		  	interceptable: false
		}
	};
	$scope.scenes.goToScene = function(sceneName, text, interceptable, data) {
		$scope.gameData.scene = sceneName;

		console.log('Scene: ' + sceneName + " Text: " + text);
		$scope.gui.actionPrompt = $scope.scenes.list[$scope.gameData.scene].actionPrompt
		$scope.gui.choices = $scope.scenes.list[$scope.gameData.scene].choices
		$scope.scenes.list[$scope.gameData.scene].script(data);

		if ($scope.scenes.list[$scope.gameData.scene].interceptable){
			var interceptReturn = $scope.interceptEvaluation(sceneName);
	  		if (interceptReturn.intercepted == true){
	  			$scope.gui.message += interceptReturn.message;
	  			$scope.gui.actionPrompt = interceptReturn.actionPrompt;
	  			$scope.gui.choices = interceptReturn.choices;
	  			
	  		}
		}
		$scope.alerts.messages();
	};

	$scope.growthProcessing = function(data, population, carryingCapacity){
		var message;

		// population growth
		switch (data[0]){
			case 'high':
				population += Math.floor(population * 0.2);
				message = "Your band grows in population and strength."
				break
			case 'stable':
				message = "The band is stable."
				population += Math.round((Math.random()-.5)*2);
				break
			case 'shrink':
				population -= Math.floor(population * 0.2)
				message = "There is some resistance but through careful family planning, you and the elders manage to reduce the band's population."
				break
		}

		// carrying capacity
		message += "<br /><br />"

		var populationResourceRatio = population / carryingCapacity

		if (populationResourceRatio < 0.4){
			message += "This land easily supports your band. Your people spend most of their time in leisure."
		}else if (populationResourceRatio < 0.75){
			message += "There are enough resources here to support your band. Your people spend some time foraging but there is still plenty of leisure."
		}else if (populationResourceRatio <= 1.0){
			message += "There are barely enough resources here to support your band. Your people spend most of their time scrounging for food."
		}else if (populationResourceRatio > 1.0){
			message += "This land cannot support your band. You are too many and it is not nearly fertile enough. Your people spend all their time foraging and yet still some starve."
			population -= Math.floor(Math.random()*(population - carryingCapacity))+5;	
		}

		var actionPrompt = "What now?"

		var sceneInfo = {
			message: message,
			actionPrompt: actionPrompt,
			choices: utils.growthChoices
		}

		$scope.gameData.population = population
		return sceneInfo
	}

	$scope.interceptEvaluation = function(data){	

		var interceptReturn = {
			intercepted: false
		}



		// agriculture
		if (($scope.gameData.turnsStationary > 1) && !$scope.gameData.agriculture){
			var compoundingOdds = 0.95;
			interceptReturn.intercepted = (Math.random() > Math.pow(compoundingOdds,$scope.gameData.turnsStationary))
			if (interceptReturn.intercepted) {
				$scope.gameData.agriculture = 1;
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





	$scope.gui.actionPrompt = $scope.scenes.list[$scope.gameData.scene].actionPrompt
	$scope.gui.choices = $scope.scenes.list[$scope.gameData.scene].choices
	$scope.scenes.list[$scope.gameData.scene].script()

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
