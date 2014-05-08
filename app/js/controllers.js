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
	this.turnsStationary = 0
	this.carryingCapacity = 100
}

var utils = {
	landAdjective: [
		"fertile",
		"desolate",
		"pleasant",
		"lush",
		"barren",
		"temperate",
		"bountiful",
		"abundant",
		"safe",
		"glorious",
		"breathtaking",
		"gorgeous"
	],

	landType: [
		"valley",
		"vale",
		"plain",
		"canyon",
		"coast",
		"isthmus",
		"expanse",
		"land",
		"region",
		"place"
	],

	pickRandomFromList: function(list){
		return list[Math.floor(Math.random()*list.length)];
	},
	
	randomLandDescription: function(){
		var adjective = utils.pickRandomFromList(utils.landAdjective);
		var type = utils.pickRandomFromList(utils.landType);

		return adjective + " " + type;

	}
}

angular.module('myApp.controllers', [])
  .controller('GameCtrl', ['$scope', function($scope) {
  	$scope.gui = {};
  	$scope.gameData = new startingData;
  	$scope.gameData.land = utils.randomLandDescription();

	$scope.scenes = {}
	$scope.scenes.list = {
		intro: {
			message: "The mountain spews fire. The mountain spirit must be angry. Kinsman have always hunted and gathered here. They turn to you, " + $scope.gameData.leader + ", for guidance.",
			actionPrompt: "Abandon homeland or make a sacrifice to the mountain?",
			choices: [
		  		{text: "Flee", nextScene: 'flee', data: {}},
		  		{text: "Sacrifice", nextScene: 'sacrifice', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData = new startingData;
		  	}
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

		  	}
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

		  	}
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

		  	}
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
		  	}
		},
		stayAndGrow: {
			message: "The "+ $scope.gameData.land +" becomes home. One of your key concerns is population growth.",
			actionPrompt: "What does the future hold for your band?",
			choices: [
		  		{text: "Stablize Population", nextScene: 'growth', data: ['stable']},
		  		{text: "High Growth", nextScene: 'growth', data: ['high']},
		  		{text: "Shrink Band", nextScene: 'growth', data: ['shrink']},
		  		{text: "Move on", nextScene: 'move', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.turnsStationary += 1;
		  	}
		},
		growth: {
			message: "",
			actionPrompt: "",
			choices: [
		  		{text: "Restart", nextScene: 'TODO', data: {}},
		  		{text: "Restart", nextScene: 'TODO', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.generation += 1;
		  		var growthReturn = $scope.growthProcessing(data, $scope.gameData.population, $scope.gameData.carryingCapacity)
		  		$scope.scenes.list.growth.message = growthReturn.message;
		  		$scope.scenes.list.growth.actionPrompt = growthReturn.actionPrompt;
		  		$scope.scenes.list.growth.choices = growthReturn.choices;
		  	}
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
		  	}
		},
		pyroclastic: {
			message: "The pyre illuminates the night sky. As the ceremony begins, you are engulfed by a pyroclastic flow. Your band dies a swift and painless death.",
			actionPrompt: "Game Over",
			choices: [
		  		{text: "Restart", nextScene: 'intro', data: {}}
		  	],
		  	script: function(data){
		  		$scope.gameData.population = 0;
		  	}
		},
		TODO: {
			message: "",
			actionPrompt: "",
			choices: [
		  		{text: "Restart", nextScene: 'intro', data: {}},
		  		{text: "Restart", nextScene: 'intro', data: {}}
		  	],
		  	script: function(data){

		  	}
		}
	};
	$scope.scenes.goToScene = function(sceneName, text, data) {
		$scope.gameData.scene = sceneName;
		console.log('Scene: ' + sceneName + " Text: " + text);
		$scope.gui = $scope.scenes.list[$scope.gameData.scene]
		$scope.gui.script(data);
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
				break
			case 'shrink':
				population -= Math.floor(population * 0.2)
				message = "There is some resistance but through careful family planning, you and the elders manage to reduce the band's population."
				break
		}

		// carrying capacity
		
		var populationResourceRatio = population / carryingCapacity

		if (populationResourceRatio < 0.4){
			message += " This land easily supports your band. Your people spend most of their time in leisure."
		}else if (populationResourceRatio < 0.75){
			message += " There are enough resources here to support your band. Your people spend some time foraging but there is still plenty of leisure."
		}else if (populationResourceRatio <= 1.0){
			message += " There are barely enough resources here to support your band. Your people spend most of their time scrounging for food."
		}else if (populationResourceRatio > 1.0){
			message += " This land cannot support your band. You are too many and it is not nearly fertile enough. Your people spend all their time foraging and yet still some starve."
			population -= Math.floor(Math.random()*(population - carryingCapacity))+5;	
		}

		var actionPrompt = "What now?"
		var choices = [
		  		{text: "Stablize Population", nextScene: 'growth', data: ['stable']},
		  		{text: "High Growth", nextScene: 'growth', data: ['high']},
		  		{text: "Shrink Band", nextScene: 'growth', data: ['shrink']},
		  		{text: "Move on", nextScene: 'move', data: {}}
		  	]

		var sceneInfo = {
			message: message,
			actionPrompt: actionPrompt,
			choices: choices
		}

		$scope.gameData.population = population
		return sceneInfo
	}






	$scope.gui = $scope.scenes.list[$scope.gameData.scene]
  	

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
