/****************************************************************************
    fcoo-language.js, 

    (c) 2016, FCOO

    https://github.com/FCOO/fcoo-language
    https://github.com/FCOO

****************************************************************************/

(function ($, window/*, document, undefined*/) {
    "use strict";
    
    //Create fcoo-namespace
    window.fcoo = window.fcoo || {};

    var ns = window.fcoo; 

//var test = window.niels = window.niels || {};


    /******************************************
    Initialize/ready 
    *******************************************/
    $(function() { 
/* TODO:        
        var standardLanguage = 'en',            //Standard language is allways english (en)
            standardLanguages = ['da', 'en'],   //Standard languages is allways danish (da) and english (en)
            browserLanguage,                    //Language of the browser
            browserStandardLanguage,            //Standard language of the browser (if available) 
            i18nLanguageList = [];

        function getLanguage( language_country ){ return language_country.split('-')[0]; }
        function isStandardLanguage( lang ){ return standardLanguages.indexOf( lang ) > -1; }    //Return true if lang is 'da' or 'en'
        function otherStandardLanguage( lang ){ 
            if ( isStandardLanguage( lang ) )
              return lang == 'da' ? 'en' : 'da';
            else
              return 'en';
            }

        //Try to get browser or system language
        browserLanguage = getLanguage( navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || standardLanguage );
        if ( isStandardLanguage( browserLanguage ) )
            browserStandardLanguage =  otherStandardLanguage( browserLanguage );
        else {
            browserStandardLanguage = standardLanguage;
            //Try to find a standard language in navigator.languages = list of lang or null
            if (navigator.languages)
                for (var i=0; i<navigator.languages.length; i++ ){
                    var nextLang = getLanguage( navigator.languages[i] );
                    if ( isStandardLanguage( nextLang ) ){
                        browserStandardLanguage = nextLang;
                        break;
                    }
                }
        }
        
*/
        
        




        //Create fcoo.langFlag
        ns.langFlag = new window.LangFlag({ defaultFlag:'dk', defaultLang: 'da' });

        //Change language in ns.langFlag when i18next changes lang
        i18next.on('languageChanged', function(lng) {
            ns.langFlag.setLang(lng);
        });

 
        //Create other packages
/* REMOVED
        var LanguageDetector = new window.i18nextBrowserLanguageDetector({
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

            // keys or params to lookup language from
            lookupQuerystring: 'lang',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',

            // cache user language on
            caches: ['localStorage', 'cookie'],

            // optional expire and domain for set cookie
            cookieMinutes: 10,
            cookieDomain: 'myDomain',

            // optional htmlTag with lang attribute, the default is:
            htmlTag: document.documentElement
        });
*/


var nameOfProcessor = {
    type: 'postProcessor',
    name: 'nameOfProcessor',
    process: function(/*value, key, options, translator*/) {
        //console.log('HER','value=',value, ' key=',key, ' options=',options, ' translator=', translator);
        /* return manipulated value */
    }
};


        /***********************************************************
        Ininialize i18next
        ***********************************************************/
        i18next
 //REMOVED           .use( LanguageDetector )
.use(nameOfProcessor)
            .use( window.i18nextIntervalPluralPostProcessor )
            .init({
              lng: 'da',
                useDataAttrOptions: true, 

                debug: true,
                postProcess: ['nameOfProcessor'],
                resources: {
                    "en": {
                        "translation": {
                            "nav": {
                                "home"  : "Home",
                                "page1" : "Page One",
                                "page2" : "Page Two",
                                "change": "Change",
                                "position": "position",
                                "position_plural": "positions"

                            }
                        }
                    },
                    "da": {
                        "translation": {
                            "nav": {
                                "home"  : "Hjem",
                                "page1" : "Side Et",
                                "page2" : "Side To",
                                "change": "Skift",
                                "position": "position",
                                "position_plural": "{{count}} positioner",
                                "bil_interval": "(1){en bil};(2-3){2-3 biler};(4-inf){mange biler};",
                                 
                            }
                        }
                    }

                }

            });



/*
{
  type: 'postProcessor',
  name: 'nameOfProcessor',
  process: function(value, key, options, translator) {
  }
}
*/

//console.log (

//    i18next.t('nav.position', {count:0}),
//    i18next.t('nav.bil_interval', {postProcess: 'interval', count:2})
//    i18next.t('nav.bil_interval', {postProcess: 'nameOfProcessor', count:2})
//);
        
        
        
        /***********************************************************
        jquery-i18next - i18next plugin for jquery 
        https://github.com/i18next/jquery-i18next
        ***********************************************************/
        window.jqueryI18next.init(i18next/*i18nextInstance*/, $, {
            tName         : 't',               // --> appends $.t = i18next.t
            i18nName      : 'i18n',            // --> appends $.i18n = i18next
            handleName    : 'localize',        // --> appends $(selector).localize(opts);
            selectorAttr  : 'data-i18n',       // selector for translating elements
            targetAttr    : 'i18n-target',     // data-() attribute to grab target element to translate (if diffrent then itself)
            optionsAttr   : 'i18n-options',    // data-() attribute that contains options, will load/set if useOptionsAttr = true
            useOptionsAttr: false,             // see optionsAttr
            parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
        });

        $("*").localize();        

        //Update all element when language changes
        i18next.on('languageChanged', function() {
            $("*").localize();        
        });









    }); //End of initialize/ready
    //******************************************



}(jQuery, this, document));