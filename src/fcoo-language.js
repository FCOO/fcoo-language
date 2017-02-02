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
    var languagechanged = "languagechanged";
    
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
    window.fcoo.settings.add({
        id          : 'language', 
        validator   : validateLanguage,
        applyFunc   : function( lang ){ setLanguageAndLanguage2( lang, window.fcoo.settings.get('language2') ); }, 
        defaultValue: defaultLanguage,
        callApply   : false
    });

    //language used when initialize i18next
    var language = window.fcoo.settings.get( 'language' );

    
    /***********************************************************
    Set up and load language2 via fcoo.settings
    ***********************************************************/
    window.fcoo.settings.add({
        id          : 'language2', 
        validator   : validateLanguage,
        applyFunc   : function( lang2 ){ setLanguageAndLanguage2( i18next.language, lang2 ); },
        defaultValue: standardLanguage,
        callApply   : false
    });
    
    
    //fallback used when initialize i18next
    var fallbackLng = getFallbackLng( language, window.fcoo.settings.get('language2') );

    
    /***********************************************************
    Create fcoo.langFlag
    ***********************************************************/
    ns.langFlag = new window.LangFlag({ defaultFlag:'dk', defaultLang: 'da' });

    //Change language in ns.langFlag when language is changed
    window.fcoo.events.on( languagechanged, function(){
        ns.langFlag.setLang( i18next.language );
    });


    /***********************************************************************
    Extend i18next
    ************************************************************************
    Default 1-dim json-structure for i18next is 
        { lang1: { 
            namespace: { key: value1 }
          },
          lang2: { 
            namespace: { key: value2 }
          }
        }
    To make adding translation easier a new format is supported: 
        { namespace: {
            key: {
              lang1: value1,
              lang2: value2
            }
        }

    
    Four methods areadded to i18next:
        addPhrase( key, [namespace,] langValue) 
        - key {string} can be a combined namespace:key string. 
        - langValue = { {lang: value}xN }

        addPhrases( [namespace,] keyLangValue )
        - keyLangValue = { key: {lang: value}xN }, key2: {lang: value}xN } }

        sentence ( langValue, options )
        - langValue = { {lang: value}xN }

        s ( langValue, options )
        - langValue = { {lang: value}xN }
    ***********************************************************************/

    /***********************************************************************
    addPhrase( key, [namespace,] langValue) 
    - key {string} can be a combined namespace:key string. 
    - langValue = { {lang: value}xN }
    ***********************************************************************/
    i18next.addPhrase = function( namespace, key, langValue ){
        if (arguments.length == 2){
            langValue = arguments[1];
            if (arguments[0].indexOf(':') > -1){
              key = arguments[0].split(':')[1];
              namespace = arguments[0].split(':')[0];
            }
            else {
                key = arguments[0];
                namespace = this.options.defaultNS[0];
            }
        }
        var _this = this;

        $.each( langValue, function( lang, value ){
            _this.addResource(lang, namespace, key, value);
        });
        return this;
    };

    /***********************************************************************
    addPhrases( [namespace,] keyLangValue )
    - keyLangValue = { key: {lang: value}xN }, key2: {lang: value}xN } }
    ***********************************************************************/
    i18next.addPhrases = function( namespace, keyLangValue ){
        var _this = this;
        $.each( keyLangValue, function( key, langValue ){
            _this.addPhrase( namespace, key, langValue );
        });
        return this;
    };
        
    /***********************************************************************
    i18next.loadPhrases( jsonFileName );
    namespaceKeyLangValue = 
        {   namespaceA: {
                keyA: {
                    langA: "The text",
                    langB: "Tekst"
                },
                keyB: { ... }
            },
            namespaceB :{ ... }
        }
    ***********************************************************************/
    i18next.loadPhrases = function( jsonFileName, onFail ){
        var jqxhr = $.getJSON( jsonFileName );
        if (onFail)
            jqxhr.fail( onFail );

        jqxhr.done( function( data ) {
            $.each( data, function( namespace, keyLangValue ) {
                i18next.addPhrases( namespace, keyLangValue );
            });
        });
    };
    
    /***********************************************************************
    sentence ( langValue, options )
    - langValue = { {lang: value}xN }
    A single translation of a sentence. No key used or added
    ***********************************************************************/
    i18next.sentence = function( langValue, options ){
        var nsTemp = '__TEMP__',
            keyTemp = '__KEY__',
            _this = this;
        
        //Remove any data from nsTemp
        $.each( languages, function( index, lang ){
            _this.removeResourceBundle(lang, nsTemp);
        });
        this.addPhrase( nsTemp, keyTemp, langValue );
        return this.t(nsTemp + this.options.nsSeparator + keyTemp, options );
    };

    /***********************************************************************
    s ( langValue, options )
    - langValue = { {lang: value}xN }
    ***********************************************************************/
    i18next.s = function( langValue, options ){
        return this.sentence( langValue, options );
    };


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

        
    //Fire languagechenged when language is changed
    i18next.on('languageChanged', function() {
        window.fcoo.events.fire( languagechanged );
    });


    /***********************************************************
    jquery-i18next - i18next plugin for jquery 
    https://github.com/i18next/jquery-i18next
    ***********************************************************/
    var jQuery_i18n_selectorAttr = 'data-i18n',    // selector for translating elements
        jQuery_i18n_targetAttr   = 'i18n-target',  // data-() attribute to grab target element to translate (if diffrent then itself)
        jQuery_i18n_optionsAttr  = 'i18n-options'; // data-() attribute that contains options, will load/set if useOptionsAttr = true

    
    window.jqueryI18next.init(
        i18next/*i18nextInstance*/, 
        $, 
        {
            tName         : 't',                        // --> appends $.t = i18next.t
            i18nName      : 'i18n',                     // --> appends $.i18n = i18next
            handleName    : 'localize',                 // --> appends $(selector).localize(opts);
            selectorAttr  : jQuery_i18n_selectorAttr,   // selector for translating elements
            targetAttr    : jQuery_i18n_targetAttr,     // data-() attribute to grab target element to translate (if diffrent then itself)
            optionsAttr   : jQuery_i18n_optionsAttr,    // data-() attribute that contains options, will load/set if useOptionsAttr = true
            useOptionsAttr: true,                       // see optionsAttr
            parseDefaultValueFromContent: true          // parses default values from content ele.val or ele.text
        }
    );


    /*
    Add new methods to jQuery prototype: 
    $.fn.i18n( key[, attribute][, options] )
    Add/updates the "data-i18n" attribute
    */
    $.fn.extend({
        i18n: function(key) {
            var options = null, attribute = '', argument;
            for (var i=1; i<arguments.length; i++ ){
                argument = arguments[i];              
                switch ($.type(argument)){
                  case 'object': options = argument; break;
                  case 'string': attribute = argument; break;
                }
            }

            return this.each(function() {
                var $this = $(this),
                    oldData = $this.attr( jQuery_i18n_selectorAttr ),
                    newData = [],
                    oldStr,
                    newStr = attribute ? '[' + attribute + ']' + key : key,
                    keep;
                oldData = oldData ? oldData.split(';') : [];
            
                for (var i=0; i<oldData.length; i++ ){
                    oldStr = oldData[i];
                    keep = true;
                    //if the new key has an attribute => remove data with '[attribute]'
                    if (attribute && (oldStr.indexOf('[' + attribute + ']') == 0))
                        keep = false;                      
                    //if the new key don't has a attribute => only keep other attributes
                    if (!attribute && (oldStr.indexOf('[') == -1)) 
                      keep = false;

                    if (keep)
                      newData.push( oldStr );
                }
                newData.push( newStr);                                

                //Set data-i18n
                $this.attr( jQuery_i18n_selectorAttr, newData.join(';') );

                //Set data-i18n-options
                if (options)
                    $this.attr( 'data-' + jQuery_i18n_optionsAttr, JSON.stringify( options ) );
            });
        }
    });        


    //Update all element when language changes
    window.fcoo.events.on( languagechanged, function() { 
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
    
    //Initialize/ready 
    $(function() { 
        //Update all language related elements
        window.fcoo.settings.set('language', language );
    }); 


}(jQuery, this, document));