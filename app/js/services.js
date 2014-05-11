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

	}])

