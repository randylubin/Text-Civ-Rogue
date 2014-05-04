'use strict';

/* Directives */


angular.module('myApp.directives', []).
  	directive('appVersion', ['version', function(version) {
    	return function(scope, elm, attrs) {
      		elm.text(version);
    	};
 	}]).
	directive("enter", function() {
    	return function(scope, element) {
        	element.bind("mouseenter", function() {
            	element.addClass('choice')
            	console.log("I'm inside!");
        	})
    	}
	}).
	directive("leave", function() {
    	return function(scope, element) {
        	element.bind("mouseleave", function() {
            	console.log("I'm leaving");
        	})
    	}
	});
