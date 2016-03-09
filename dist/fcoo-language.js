/****************************************************************************
	fcoo-language.js, 

	(c) 2016, FCOO

	https://github.com/FCOO/fcoo-language
	https://github.com/FCOO

****************************************************************************/

;(function ($, window, document, undefined) {
	"use strict";
	
	//Create fcoo-namespace
	window.fcoo = window.fcoo || {};

	var ns = window.fcoo; 


	/******************************************
	Initialize/ready 
	*******************************************/
	$(function() { //"$( function() { ... });" is short for "$(document).ready( function(){...});"

		//Create fcoo.langFlag
		ns.langFlag = new window.LangFlag({ defaultFlag:'dk', defaultLang: 'da' });


		//TODO: Create other packages



	}); //End of initialize/ready
	//******************************************



}(jQuery, this, document));