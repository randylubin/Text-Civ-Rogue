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

		this.growthChoices = [[
	  		{text: "Stablize Population", nextScene: 'growth', data: ['stable']},
	  		{text: "High Growth", nextScene: 'growth', data: ['high']},
	  		{text: "Shrink Band", nextScene: 'growth', data: ['shrink']},
	  		{text: "Move on", nextScene: 'move', data: {}}
	  	]],

	  	this.bandChoices = [
	  		[
		  		{text: "Stablize Population", nextScene: 'growth', data: ['stable']},
		  		{text: "High Growth", nextScene: 'growth', data: ['high']},
		  		{text: "Shrink Band", nextScene: 'growth', data: ['shrink']}
	  		],
	  		[
	  			{text: "Hunt", nextScene: 'growth', data: ['stable']},
		  		{text: "Gather", nextScene: 'growth', data: ['stable']}
	  		],
	  		[
	  			{text: "Move on", nextScene: 'move', data: []}
	  		]

	  	]

		this.pickRandomFromList = function(list){
			return list[Math.floor(Math.random()*list.length)];
		},
		
		this.randomLandDescription = function(){
			var adjective = this.pickRandomFromList(this.landAdjective);
			var type = this.pickRandomFromList(this.landType);

			return adjective + " " + type;

		}

		this.growthProcessing = function(data, population, carryingCapacity){
			var message;
			if (!data){
				data = ['stable'];
			}

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
				choices: this.bandChoices,
				newPopulation: population
			}

			return sceneInfo
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
	service('guiModel', [function(){
		this.data = {}


	}]).
	service('alerts', [function(){
		this.data = {}

		var parentThis = this;

		this.data.reset = function(){
			this.sacrifices = 0;
		}

		this.data.messages = function(){
			if (this.sacrifices >= 2){
				alert("It's a volcano... no amount of sacrifice will save you.");
				parentThis.data.sacrifices = 0;
			}
		};

	}]).
	service('sceneModel', ['guiModel', 'utils', 'gameDataModel', 'alerts', function(guiModel, utils, gameDataModel, alerts) {
		var scenez = this;

		this.data = {}

		this.data.list = {
			intro: {
				actionPrompt: "Abandon homeland or make a sacrifice to the mountain?",
			  	script: function(data){
			  		guiModel.data.message = "The mountain spews fire. The mountain spirit must be angry. Kinsman have always hunted and gathered here. They turn to you, " + gameDataModel.data.leader + ", for guidance."
			  		gameDataModel.data.reset();
			  		gameDataModel.data.land = utils.randomLandDescription();
			  		guiModel.data.choices = [[
				  		{text: "Flee", nextScene: 'flee', data: {}},
				  		{text: "Sacrifice", nextScene: 'sacrifice', data: {}}
				  	]]
			  	}
			},
			flee: {
				actionPrompt: "Settle here or move on?",
			  	script: function(data){
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*2);
			  		guiModel.data.message = "You lead your band away from the mountain. The mountain explodes. The band heads east, away from the ash. They stop in a valley, lush with flora and fauna.";
			  		guiModel.data.choices = [[
				  		{text: "Settle", nextScene: 'firstSettle', data: {}},
				  		{text: "Move on", nextScene: 'firstMove', data: {}}
				  	]]
			  	}
			},
			firstMove: {
				actionPrompt: "Settle here or move on?",
			  	script: function(data){
			  		gameDataModel.data.land = utils.randomLandDescription();
			  		guiModel.data.message =  "Your band moves onward, foraging as you go. You reach a "+ gameDataModel.data.land +".";
			  		guiModel.data.choices = [[
				  		{text: "Settle", nextScene: 'firstSettle', data: {}},
				  		{text: "Move on", nextScene: 'firstMove', data: {}}
				  	]]
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*3);
			  		gameDataModel.data.turnsStationary = 0;


			  	}
			},
			move: {
				actionPrompt: "Settle here or move on?",
			  	script: function(data){
			  		gameDataModel.data.land = utils.randomLandDescription();
			  		guiModel.data.message =  "Your band moves onward, foraging as you go. You reach a "+ gameDataModel.data.land +".";
			  		console.log(gameDataModel.data.land)
			  		gameDataModel.data.population += Math.round((Math.random()-.5)*3);
			  		gameDataModel.data.turnsStationary = 0;
			  		guiModel.data.message = this.message;
			  		guiModel.data.choices = [[
				  		{text: "Settle", nextScene: 'stayAndGrow', data: {}},
				  		{text: "Move on", nextScene: 'move', data: {}}
				  	]]

			  	}
			},
			firstSettle: {
				actionPrompt: "Your band lives on - with the right leadership, it can thrive.",
			  	script: function(data){
			  		gameDataModel.data.population += Math.round(Math.random()*5)+2;
			  		gameDataModel.data.generation += 1;
			  		gameDataModel.data.turnsStationary = 1;
			  		guiModel.data.message = "Your people are content in their new land. Food is abundant and the weather is fair. Children are born who will never know life at the foot of the angry mountain. After several seasons you scrape your toe and die from an infection. No matter - your kinsman are wise and can thrive without you.";
			  		guiModel.data.choices = [[
				  		{text: "Stay in the "+ gameDataModel.data.land, nextScene: 'stayAndGrow', data: {}},
				  		{text: "Move on", nextScene: 'move', data: {}}
				  	]]
			  	}
			},
			stayAndGrow: {
				actionPrompt: "What does the future hold for your band?",
			  	script: function(data){
			  		scenez.data.list.stayAndGrow.message = "The " + gameDataModel.data.land + " becomes home. One of your key concerns is population growth."
			  		gameDataModel.data.turnsStationary = 1;
			  		guiModel.data.message = "The " + gameDataModel.data.land + " becomes home. One of your key concerns is population growth.";
			  		guiModel.data.choices = utils.growthChoices
			  	},
			  	manyChoices: true
			},
			growth: {
				actionPrompt: "",
			  	script: function(data){
			  		gameDataModel.data.generation += 1;
			  		gameDataModel.data.turnsStationary += 1;
			  		var growthReturn = utils.growthProcessing(data, gameDataModel.data.population, gameDataModel.data.carryingCapacity)
			  		this.message = growthReturn.message;
			  		this.actionPrompt = growthReturn.actionPrompt;
			  		//guiModel.data.choices = utils.growthChoices
			  		guiModel.data.choices = growthReturn.choices;
			  		gameDataModel.data.population = growthReturn.newPopulation;

			  		guiModel.data.message = this.message;
			  		guiModel.data.actionPrompt = this.actionPrompt
			  	},
			  	interceptable: true,
			  	manyChoices: true
			},
			sacrifice: {
				actionPrompt: "What shall be sacrificed?",
			  	script: function(data){
			  		guiModel.data.message = "You tell your kinsmen to prepare a giant pyre for the sacrifice. They start building. They gather food for a feast.";
			  		guiModel.data.choices = [[
				  		{text: "Goat", nextScene: 'pyroclastic', data: {}},
				  		{text: "Chicken", nextScene: 'pyroclastic', data: {}},
				  		{text: "An Elder", nextScene: 'pyroclastic', data: {}}
				  	]]

			  	}
			},
			pyroclastic: {
				actionPrompt: "Game Over",
			  	script: function(data){
			  		gameDataModel.data.population = 0;
			  		alerts.data.sacrifices += 1;
			  		guiModel.data.message = "The pyre illuminates the night sky. As the ceremony begins, you are engulfed by a pyroclastic flow. Your band dies a swift and painless death.";
			  		guiModel.data.choices = [[
				  		{text: "Restart", nextScene: 'intro', data: {}}
				  	]]
			  	}
			},
			firstAgriculture: {
				actionPrompt: "Wheee!",
			  	script: function(data){
			  		guiModel.data.message = "The plants return year after year. You put seeds in the ground elsewhere and the crops grow there, too.";
			  		guiModel.data.choices = [[
				  		{text: "Restart", nextScene: 'intro', data: {}},
				  		{text: "Restart", nextScene: 'intro', data: {}}
				  	]]
				  	gameDataModel.data.agriculture = 1;
			  	}
			},
			TODO: {
				actionPrompt: "",
			  	script: function(data){
			  		guiModel.data.message = "";
			  		guiModel.data.choices = [[
				  		{text: "Restart", nextScene: 'intro', data: {}},
				  		{text: "Restart", nextScene: 'intro', data: {}}
				  	]]
			  	}
			}
		};

		this.data.goToScene = function(sceneName, text, interceptable, data) {
			gameDataModel.data.scene = sceneName;
			var newScene = scenez.data.list[gameDataModel.data.scene]

			console.log('Scene: ' + sceneName + " Text: " + text);
			guiModel.data.actionPrompt = newScene.actionPrompt
			newScene.script(data);

			if (newScene.interceptable){
				var interceptReturn = scenez.data.interceptEvaluation(sceneName);
		  		if (interceptReturn.intercepted == true){
		  			guiModel.data.message += interceptReturn.message;
		  			guiModel.data.actionPrompt = interceptReturn.actionPrompt;
		  			guiModel.data.choices = interceptReturn.choices;
		  			
		  		}
			}
			alerts.data.messages();
		};

		this.data.interceptEvaluation = function(data){	

			var interceptReturn = {
				intercepted: false,
				message: "<br /><br />"
			}

			// agriculture
			if ((gameDataModel.data.turnsStationary > 1) && !gameDataModel.data.agriculture){
				var compoundingOdds = 0.99;
				interceptReturn.intercepted = (Math.random() > Math.pow(compoundingOdds,gameDataModel.data.turnsStationary))
				if (interceptReturn.intercepted) {
					interceptReturn.message = "One of your kin notice abundant vegetation on the site of an old midden."
					interceptReturn.actionPrompt = "Do you investigate further or discourage exploration of the dump?";
					interceptReturn.choices = [[
				  		{text: "Investigate", nextScene: 'firstAgriculture', data: {}},
				  		{text: "Discourage", nextScene: 'growth', data: ['stable']}
				  	]]				
				}
			}

			//band interaction
			if (!interceptReturn.intercepted) {
				var bandOdds = 0.25
				interceptReturn.intercepted = Math.random() < bandOdds
				if (interceptReturn.intercepted){
					interceptReturn.message = "You meet a nearby band."
					interceptReturn.actionPrompt = "what do you do?"
					interceptReturn.choices = utils.growthChoices //TODO
				}
			}

			return interceptReturn;
		}

	}])