'use strict';

/* Services */

angular.module('myApp.services', []).
	service('utils', [function(){

		this.landAdjective = [
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

		this.landType = [
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

		this.growthChoices = [
	  		{text: "Stablize Population", nextScene: 'growth', data: ['stable']},
	  		{text: "High Growth", nextScene: 'growth', data: ['high']},
	  		{text: "Shrink Band", nextScene: 'growth', data: ['shrink']},
	  		{text: "Move on", nextScene: 'move', data: {}}
	  	],

		this.pickRandomFromList = function(list){
			return list[Math.floor(Math.random()*list.length)];
		},
		
		this.randomLandDescription = function(){
			var adjective = this.pickRandomFromList(this.landAdjective);
			var type = this.pickRandomFromList(this.landType);

			return adjective + " " + type;

		}
  	
	}]).
	service('gameDataModel', [function(){
		this.data = {}

		this.data.reset = function(){

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

	}]).
	service('sceneModel', ['$scope', 'utils', 'gameDataModel', function($scope, utils, gameDataModel) {
		this.data = {}
		

		this.data.list = {
			intro: {
				actionPrompt: "Abandon homeland or make a sacrifice to the mountain?",
				choices: [
			  		{text: "Flee", nextScene: 'flee', data: {}},
			  		{text: "Sacrifice", nextScene: 'sacrifice', data: {}}
			  	],
			  	script: function(data){
			  		$scope.gui.message = "The mountain spews fire. The mountain spirit must be angry. Kinsman have always hunted and gathered here. They turn to you, " + gameDataModel.data.leader + ", for guidance."
			  		gameDataModel.data.reset();
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
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*2);
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
			  		gameDataModel.data.land = utils.randomLandDescription();
			  		$scope.scenes.list.firstMove.message =  "Your band moves onward, foraging as you go. You reach a "+ gameDataModel.data.land +".";
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*3);
			  		gameDataModel.data.turnsStationary = 0;
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
			  		gameDataModel.data.land = utils.randomLandDescription();
			  		$scope.scenes.list.move.message =  "Your band moves onward, foraging as you go. You reach a "+ gameDataModel.data.land +".";
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*3);
			  		gameDataModel.data.turnsStationary = 0;
			  		$scope.gui.message = this.message;

			  	},
			  	interceptable: false
			},
			firstSettle: {
				message: "Your people are content in their new land. Food is abundant and the weather is fair. Children are born who will never know life at the foot of the angry mountain. After several seasons you scrape your toe and die from an infection. No matter - your kinsman are wise and can thrive without you.",
				actionPrompt: "Your band lives on - with the right leadership, it can thrive.",
				choices: [
			  		{text: "Stay in the "+ gameDataModel.data.land, nextScene: 'stayAndGrow', data: {}},
			  		{text: "Move on", nextScene: 'move', data: {}}
			  	],
			  	script: function(data){
			  		gameDataModel.data.population += Math.round(Math.random()*5)+2;
			  		gameDataModel.data.generation += 1;
			  		gameDataModel.data.turnsStationary = 1;
			  		$scope.gui.message = this.message;
			  	},
			  	interceptable: false
			},
			stayAndGrow: {
				message: "The "+ gameDataModel.data.land +" becomes home. One of your key concerns is population growth.",
				actionPrompt: "What does the future hold for your band?",
				choices: utils.growthChoices,
			  	script: function(data){
			  		gameDataModel.data.turnsStationary = 1;
			  		$scope.gui.message = this.message;
			  	},
			  	interceptable: false
			},
			growth: {
				message: "",
				actionPrompt: "",
				choices: utils.growthChoices,
			  	script: function(data){
			  		gameDataModel.data.generation += 1;
			  		gameDataModel.data.turnsStationary += 1;
			  		var growthReturn = $scope.growthProcessing(data, gameDataModel.data.population, gameDataModel.data.carryingCapacity)
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
			  		gameDataModel.data.population = 0;
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

	}])