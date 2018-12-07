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

    //global events "languagechanged" fired when the language is changed
    var languagechanged = window.fcoo.events.LANGUAGECHANGED;

    //*****************************************************************************
    // All available languages.
    // **NOTE ** THIS LIST MUST MATCH THE LIST $lang-list IN src/fcoo-language.scss
    //******************************************************************************
    var languages = ['da', 'en',  'fo', 'kl' /*', de', 'sv', 'no'*/];
    //******************************************************************************

    var standardLanguage  = 'en',                     //Standard language is allways english (en)
        standardLanguages = [standardLanguage, 'da']; //Standard languages is allways danish (da) and english (en)

    //getLanguage( 'da-DK') => 'da'
    function getLanguage( language_country ){ return language_country.split('-')[0]; }

    //validateLanguage( lang ): Return lang if it is in languages Else return ''
    function validateLanguage( lang ){ return languages.indexOf( lang ) > -1 ? lang : ''; }

    //isStandardLanguage( lang ) Return lang if lang is in standardLanguages ('da' or 'en') Else return ''
    function isStandardLanguage( lang ){ return standardLanguages.indexOf( lang ) > -1 ? lang : ''; }

    //browserLanguage = Language of the browser
    var browserLanguage = getLanguage(
                              navigator.language ||
                              navigator.userLanguage ||
                              navigator.browserLanguage ||
                              navigator.systemLanguage ||
                              standardLanguage
                          ),

        //defaultLanguage = valid value of: param 'lang' OR the browser language OR 'en'
        defaultLanguage = validateLanguage( window.Url.queryString('lang') ) ||
                          validateLanguage( browserLanguage ) ||
                          standardLanguage;

    //The ?lang=... is removed. Is only used if no 'language' is set in fcoo.settings
    window.Url.updateSearchParam('lang');


    /***********************************************************
    Some of the contents on FCOOs web applications are only available
    in either Danish (da) or English (en).
    If the user has selected a language other than da or en they select between
    da and en to be the second language (language2 in fcoo.settings)
    This is primarily to allow users how has selected Faroese or Greenlandic
    to see no-translated contents in Danish.

    It is also possible that some phrases are translated into languages not in
    the list of available languages. Eq. links to homepages offen 'comes' in national
    language and English "smhi.se" is in Swedish or English

    The function getFallbackLng sets up the fallback languages for i18next

    ***********************************************************/
    function getFallbackLng(lang, lang2){
        var result = [];
        function addLang( newLang ){
            if ((newLang != lang) && (result.indexOf( newLang ) == -1 ))
              result.push( newLang );
        }

        //If the browser language is not among the available languages => use the browser language as first fallback
        if (languages.indexOf(browserLanguage) == -1)
            addLang(browserLanguage);

        //Validate lang2 to be 'da' or 'en' and adds it
        lang2 = isStandardLanguage( lang2 ) || isStandardLanguage( browserLanguage ) || standardLanguage;
        addLang( lang2 );

        //Add alternativ to lang 2 = da/en when lang2 is en/da
        addLang( standardLanguages[ 1 - standardLanguages.indexOf( lang2 ) ] );

        return result;
    }


    /***********************************************************
    setLanguageAndLanguage2
    ***********************************************************/
    function setLanguageAndLanguage2(lang, lang2){
        i18next.options.fallbackLng = getFallbackLng(lang, lang2);
        i18next.changeLanguage( lang );
    }

    /***********************************************************
    Set up and load language via fcoo.settings
    ***********************************************************/
    ns.settings.add({
        id          : 'language',
        validator   : validateLanguage,
        applyFunc   : function( lang ){ setLanguageAndLanguage2( lang, ns.settings.get('language2') ); },
        defaultValue: defaultLanguage,
        callApply   : false
    });

    //language used when initialize i18next
    var language = ns.settings.get( 'language' );


    /***********************************************************
    Set up and load language2 via fcoo.settings
    ***********************************************************/
    ns.settings.add({
        id          : 'language2',
        validator   : validateLanguage,
        applyFunc   : function( lang2 ){ setLanguageAndLanguage2( i18next.language, lang2 ); },
        defaultValue: standardLanguage,
        callApply   : false
    });


    //fallback used when initialize i18next
    var fallbackLng = getFallbackLng( language, ns.settings.get('language2') );

    /***********************************************************
    Ininialize i18next
    ***********************************************************/
    i18next.init({
        lng         : language,
        fallbackLng : fallbackLng,
        keySeparator: '#',

        useDataAttrOptions: true,
        initImmediate     : false, //prevents resource loading in init function inside setTimeout (default async behaviour)
        resources         : {},    //Empty bagend

        //debug: true,
    });
    i18next.use( window.i18nextIntervalPluralPostProcessor );


    //To capture both language-change by fcoo.settings and by i18next direct
    //fire globalEvent LANGUAGECHENGED when language is changed via i18next
    i18next.on('languageChanged', function() {
        ns.events.fire( languagechanged );
    });

    //Set modernizr-test and set all element when language changes
    ns.events.on( languagechanged, function() {
        var $html = $('html');
        $.each( languages, function( index, lang ){
            $html.modernizrToggle('lang-'+lang, lang == i18next.language);
        });

        $("*").localize();
    });


    //Template to adding own proccessor
/*
    var nameOfProcessor = {
    type: 'postProcessor',
    name: 'nameOfProcessor',
    process: function( value, key, options, translator ) {
                // manipulate value
                return value;
            }
    };
    i18next.use(nameOfProcessor);
*/

    //Update all language related elements
    ns.settings.set('language', language );


}(jQuery, this, document));