/****************************************************************************
    fcoo-language.js,

    (c) 2016, FCOO

    https://github.com/FCOO/fcoo-language
    https://github.com/FCOO

****************************************************************************/

(function ($, i18next, window/*, document, undefined*/) {
    "use strict";

    //Create fcoo-namespace
    window.fcoo = window.fcoo || {};
    var ns = window.fcoo;

    //global events "languagechanged" fired when the language is changed
    var languagechanged = window.fcoo.events.LANGUAGECHANGED;

    //dont_call_global_events = true => ns.events.fire( languagechanged ); is NOT called when language is changed
    var dont_call_global_events = false;


    //*****************************************************************************
    // All available languages.
    // **NOTE ** THIS LIST MUST MATCH THE LIST $lang-list IN src/fcoo-language.scss
    //******************************************************************************
    var languages = ['da', 'en'/*, 'fo', 'kl', 'de', 'sv', 'no'*/];
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
    ns.globalSetting.add({
        id            : 'language',
        validator     : validateLanguage,
        applyFunc     : function( lang ){ setLanguageAndLanguage2( lang, ns.globalSetting.get('language2') ); },
        defaultValue  : defaultLanguage,
        callApply     : false,
        onChanging    : function( lang ){
                            dont_call_global_events = true;
                            i18next.changeLanguage(lang);
                            ns.globalSetting.modalForm.$bsModal.localize();
                            dont_call_global_events = false;
                        },
        globalEvents  : ns.events.LANGUAGECHANGED
    });

    //language used when initialize i18next
    var language = ns.globalSetting.get( 'language' );


    /***********************************************************
    Set up and load language2 via fcoo.settings
    ***********************************************************/
    ns.globalSetting.add({
        id            : 'language2',
        validator     : validateLanguage,
        applyFunc     : function( lang2 ){ setLanguageAndLanguage2( i18next.language, lang2 ); },
        defaultValue  : standardLanguage,
        callApply     : false,
        globalEvents  : ns.events.LANGUAGECHANGED
    });


    //fallback used when initialize i18next
    var fallbackLng = getFallbackLng( language, ns.globalSetting.get('language2') );


    /***********************************************************
    lang2flag: function(lang) return the flag/country id associated with language lang
    ***********************************************************/
    ns.lang2flag = function(lang){
        var flag = lang;
        switch (lang){
            case 'da': flag = 'dk'; break; //Danish -> Denmark
            case 'en': flag = 'gb'; break; //English -> UK
            case 'kl': flag = 'gl'; break; //Kalaallisut/Greenlandic -> Greenland
            case 'sv': flag = 'se'; break; //Swedish -> Sweden

            //All other language has same code as country
            //case 'fo': flag = 'fo'; break; //Faroese -> Faroe Islands
            //case 'de': flag = 'de'; break; //German -> Germany
            //case 'no': flag = 'no'; break; //Norwegian -> Norway
        }
        return flag;
    };

    /***********************************************************
    country2lang or flag2lang: function(flag) return the language id associated with country flag
    ***********************************************************/
    ns.country2lang = ns.flag2lang = function(flag){
        var lang = flag;
        switch (flag){
            case 'dk': lang = 'da'; break; //Denmark -> Danish
            case 'gb':
            case 'us': lang = 'en'; break; //English -> UK, USA -> English TODO: Add other english-speaking countries
            case 'gl': lang = 'kl'; break; //Greenland -> Kalaallisut/Greenlandic
            case 'se': lang = 'sv'; break; //Sweden -> Swedish

            //All other country has same code as language (I hope!)
        }
        return lang;
    };



    /***********************************************************
    flag2FlagClass: function(flag)
    ***********************************************************/
    ns.flag2FlagClass = function(flag, isIcon){
        return (isIcon ? 'fa ' : '') + 'fa-flag-'+flag;
    };

    /***********************************************************
    lang2FlagClass: function(lang) return the flag/country id associated with language lang
    ***********************************************************/
    ns.lang2FlagClass = function(lang, isIcon){
        return ns.flag2FlagClass(ns.lang2flag(lang), isIcon);
    };

    /***********************************************************
    Craete modal-content for Ininialize i18next
    ***********************************************************/
    var items = [];
    //Create i18next-record for all avaiable languages
    $.each({
        da: {da:'Dansk', en:'Danish'},
        en: {da:'Engelsk', en:'English'},
        fo: {da:'Færøsk', en:'Faroese', fo:'Føroyskt'},
        kl: {da:'Grønlandsk', en:'Greenlandic', kl:'Kalaallisut'},
        de: {da:'Tysk', en:'German', de:'Deutsch'},
        sv: {da:'Svensk', en:'Swedish', sv:'Svenska'},
        no: {da:'Norsk', en:'Norwegian', no:'Norsk'}
    },
    function(langId, langText){
        if (validateLanguage(langId))
            items.push({
                id   :langId,
                icon: ns.lang2FlagClass(langId, true),
                text: [langText[langId], '/', {da: langText.da, en:langText.en}]
            });
    });


    var content = [{
            id  :'language',
            type: 'selectlist',
            items: items,
        }];
    if (languages.length > 2)
        content.push({
            id  :'language2',
            type: 'select',
            label: {da:'Alternativt sprog', en:'Alternative language'},
            items:[
                {id:'da', icon: ns.lang2FlagClass('da'), text: {da:'Dansk', en:'Danish'}},
                {id:'en', icon: ns.lang2FlagClass('en'), text: {da:'Engelsk', en:'English'}},
            ],
            hideWhen: {
                'language': ['da','en']
            },
            lineBefore: true,
        });
    ns.globalSetting.addModalContent(languagechanged, content);


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
        if (!dont_call_global_events)
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
    ns.globalSetting.set({'language': language} );


    //ns.getLanguageName(code) return the name of the language with code
    ns.getLanguageName = function(code){
        var result = languageName[code];
        return result || {da:code, en:code};
    };

    //languageName = {lang-code}{da,en}
    var languageName = {
        "aa": {"da":"Afar","en":"Afar"},
        "ab": {"da":"Abkhaziansk","en":"Abkhazian"},
        "af": {"da":"Afrikaans","en":"Afrikaans"},
        "am": {"da":"Amharisk","en":"Amharic"},
        "ar": {"da":"Arabisk","en":"Arabic"},
        "as": {"da":"Assamesisk","en":"Assamese"},
        "ay": {"da":"Aymara","en":"Aymara"},
        "az": {"da":"Azerbaijansk","en":"Azerbaijani"},
        "ba": {"da":"Bashkir","en":"Bashkir"},
        "be": {"da":"Byelorussisk","en":"Belarusian"},
        "bg": {"da":"Bulgarsk","en":"Bulgarian"},
        "bh": {"da":"Bihari","en":"Bihari languages"},
        "bi": {"da":"Bislama","en":"Bislama"},
        "bn": {"da":"Bengalsk (Bangla)","en":"Bengali"},
        "bo": {"da":"Tibetansk","en":"Tibetan"},
        "br": {"da":"Bretonsk","en":"Breton"},
        "ca": {"da":"Catalansk","en":"Catalan; Valencian"},
        "co": {"da":"Korsikansk","en":"Corsican"},
        "cs": {"da":"Tjekkisk","en":"Czech"},
        "cy": {"da":"Walisisk","en":"Welsh"},
        "da": {"da":"Dansk","en":"Danish"},
        "de": {"da":"Tysk","en":"German"},
        "dz": {"da":"Bhutani","en":"Dzongkha"},
        "el": {"da":"Græsk, Moderne (fra 1453)","en":"Greek, Modern (1453-)"},
        "en": {"da":"Engelsk","en":"English"},
        "eo": {"da":"Esperanto","en":"Esperanto"},
        "es": {"da":"Spansk (Castiliansk)","en":"Spanish; Castilian"},
        "et": {"da":"Estisk","en":"Estonian"},
        "eu": {"da":"Baskisk","en":"Basque"},
        "fa": {"da":"Persisk (Farsi)","en":"Persian"},
        "fi": {"da":"Finsk","en":"Finnish"},
        "fj": {"da":"Fiji","en":"Fijian"},
        "fo": {"da":"Færøsk","en":"Faroese"},
        "fr": {"da":"Fransk","en":"French"},
        "fy": {"da":"Frisisk","en":"Western Frisian"},
        "ga": {"da":"Irsk","en":"Irish"},
        "gd": {"da":"Gælisk, Skotsk","en":"Gaelic; Scottish Gaelic"},
        "gl": {"da":"Galicisk","en":"Galician"},
        "gn": {"da":"Guarani","en":"Guarani"},
        "gu": {"da":"Gujarati","en":"Gujarati"},
        "ha": {"da":"Hausa","en":"Hausa"},
        "he": {"da":"Hebraisk","en":"Hebrew"},
        "hi": {"da":"Hindi","en":"Hindi"},
        "hr": {"da":"Kroatisk (Hrvatski)","en":"Croatian"},
        "hu": {"da":"Ungarsk","en":"Hungarian"},
        "hy": {"da":"Armensk","en":"Armenian"},
        "ia": {"da":"Interlingua (Internat. Auxilary Language Assoc.)","en":"Interlingua (International Auxiliary Language Association)"},
        "id": {"da":"Indonesisk","en":"Indonesian"},
        "ie": {"da":"Interlingue","en":"Interlingue; Occidental"},
        "ik": {"da":"Inupiak","en":"Inupiaq"},
        "is": {"da":"Islandsk","en":"Icelandic"},
        "it": {"da":"Italiensk","en":"Italian"},
        "iu": {"da":"Inuktitut (Eskimoisk)","en":"Inuktitut"},
        "ja": {"da":"Japansk","en":"Japanese"},
        "jw": {"da":"Javanesisk"},
        "ka": {"da":"Georgisk","en":"Georgian"},
        "kk": {"da":"Kazakh","en":"Kazakh"},
        "kl": {"da":"Grønlandsk","en":"Kalaallisut; Greenlandic"},
        "km": {"da":"Cambodiansk","en":"Central Khmer"},
        "kn": {"da":"Kannada","en":"Kannada"},
        "ko": {"da":"Koreansk","en":"Korean"},
        "ks": {"da":"Kashmirsk","en":"Kashmiri"},
        "ku": {"da":"Kurdisk","en":"Kurdish"},
        "ky": {"da":"Kirghisisk","en":"Kirghiz; Kyrgyz"},
        "la": {"da":"Latin","en":"Latin"},
        "ln": {"da":"Lingala","en":"Lingala"},
        "lo": {"da":"Laothisk (Lao)","en":"Lao"},
        "lt": {"da":"Lithauisk","en":"Lithuanian"},
        "lv": {"da":"Lettisk)","en":"Latvian"},
        "mg": {"da":"Malagasy","en":"Malagasy"},
        "mi": {"da":"Maori","en":"Maori"},
        "mk": {"da":"Makedonisk","en":"Macedonian"},
        "ml": {"da":"Malayalam","en":"Malayalam"},
        "mn": {"da":"Mongolsk","en":"Mongolian"},
        "mo": {"da":"Moldavisk"},
        "mr": {"da":"Marathi","en":"Marathi"},
        "ms": {"da":"Malaysisk","en":"Malay"},
        "mt": {"da":"Maltesisk","en":"Maltese"},
        "my": {"da":"Burmesisk","en":"Burmese"},
        "na": {"da":"Nauru","en":"Nauru"},
        "ne": {"da":"Nepalesisk","en":"Nepali"},
        "nl": {"da":"Hollandsk","en":"Dutch; Flemish"},
        "no": {"da":"Norsk","en":"Norwegian"},
        "oc": {"da":"Occitan, Langue d'oc (efter 1500)","en":"Occitan (post 1500)"},
        "om": {"da":"Oromo (Afan, Galla)","en":"Oromo"},
        "or": {"da":"Oriya","en":"Oriya"},
        "pa": {"da":"Panjabi (Punjabi)","en":"Panjabi; Punjabi"},
        "pl": {"da":"Polsk","en":"Polish"},
        "ps": {"da":"Pushto (Pashto)","en":"Pushto; Pashto"},
        "pt": {"da":"Portugisisk","en":"Portuguese"},
        "qu": {"da":"Quechua","en":"Quechua"},
        "rm": {"da":"Rhaeto-Romansk","en":"Romansh"},
        "rn": {"da":"Kirundi (Rundi)","en":"Rundi"},
        "ro": {"da":"Rumænsk","en":"Romanian; Moldavian; Moldovan"},
        "ru": {"da":"Russisk","en":"Russian"},
        "rw": {"da":"Kinyarwanda","en":"Kinyarwanda"},
        "sa": {"da":"Sanskrit","en":"Sanskrit"},
        "sd": {"da":"Sindhi","en":"Sindhi"},
        "sg": {"da":"Sango","en":"Sango"},
        "sh": {"da":"Serbo-Kroatisk (Romansk)"},
        "si": {"da":"Singhalesisk","en":"Sinhala; Sinhalese"},
        "sk": {"da":"Slovakisk","en":"Slovak"},
        "sl": {"da":"Slovensk","en":"Slovenian"},
        "sm": {"da":"Samoansk","en":"Samoan"},
        "sn": {"da":"Shona","en":"Shona"},
        "so": {"da":"Somalisk","en":"Somali"},
        "sq": {"da":"Albansk","en":"Albanian"},
        "sr": {"da":"Serbisk","en":"Serbian"},
        "ss": {"da":"Siswati","en":"Swati"},
        "st": {"da":"Sydlig Sotho (Sesotho)","en":"Sotho, Southern"},
        "su": {"da":"Sundanesisk","en":"Sundanese"},
        "sv": {"da":"Svensk","en":"Swedish"},
        "sw": {"da":"Swahili","en":"Swahili"},
        "ta": {"da":"Tamilsk","en":"Tamil"},
        "te": {"da":"Telugu","en":"Telugu"},
        "tg": {"da":"Tajik","en":"Tajik"},
        "th": {"da":"Thai","en":"Thai"},
        "ti": {"da":"Tigrinya","en":"Tigrinya"},
        "tk": {"da":"Turkmenisk","en":"Turkmen"},
        "tl": {"da":"Tagalog","en":"Tagalog"},
        "tn": {"da":"Setswana","en":"Tswana"},
        "to": {"da":"Tonga","en":"Tonga (Tonga Islands)"},
        "tr": {"da":"Tyrkisk","en":"Turkish"},
        "ts": {"da":"Tsonga","en":"Tsonga"},
        "tt": {"da":"Tatar","en":"Tatar"},
        "tw": {"da":"Twi","en":"Twi"},
        "ug": {"da":"Uigur","en":"Uighur; Uyghur"},
        "uk": {"da":"Ukrainisk","en":"Ukrainian"},
        "ur": {"da":"Urdu","en":"Urdu"},
        "uz": {"da":"Uzbekisk","en":"Uzbek"},
        "vi": {"da":"Vietnamesisk","en":"Vietnamese"},
        "vo": {"da":"Volapük","en":"Volapük"},
        "wo": {"da":"Wolof","en":"Wolof"},
        "xh": {"da":"Xhosa","en":"Xhosa"},
        "yi": {"da":"Jiddisch","en":"Yiddish"},
        "yo": {"da":"Yoruba","en":"Yoruba"},
        "zh": {"da":"Kinesisk","en":"Chinese"},
        "zu": {"da":"Zulu","en":"Zulu"},
        "ae": {"en":"Avestan"},
        "ak": {"en":"Akan"},
        "an": {"en":"Aragonese"},
        "av": {"en":"Avaric"},
        "bm": {"en":"Bambara"},
        "bs": {"en":"Bosnian"},
        "ce": {"en":"Chechen"},
        "ch": {"en":"Chamorro"},
        "cr": {"en":"Cree"},
        "cu": {"en":"Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic"},
        "cv": {"en":"Chuvash"},
        "dv": {"en":"Divehi; Dhivehi; Maldivian"},
        "ee": {"en":"Ewe"},
        "ff": {"en":"Fulah"},
        "gv": {"en":"Manx"},
        "ho": {"en":"Hiri Motu"},
        "ht": {"en":"Haitian; Haitian Creole"},
        "hz": {"en":"Herero"},
        "ig": {"en":"Igbo"},
        "ii": {"en":"Sichuan Yi; Nuosu"},
        "io": {"en":"Ido"},
        "jv": {"en":"Javanese"},
        "kg": {"en":"Kongo"},
        "ki": {"en":"Kikuyu; Gikuyu"},
        "kj": {"en":"Kuanyama; Kwanyama"},
        "kr": {"en":"Kanuri"},
        "kv": {"en":"Komi"},
        "kw": {"en":"Cornish"},
        "lb": {"en":"Luxembourgish; Letzeburgesch"},
        "lg": {"en":"Ganda"},
        "li": {"en":"Limburgan; Limburger; Limburgish"},
        "lu": {"en":"Luba-Katanga"},
        "mh": {"en":"Marshallese"},
        "nb": {"en":"Bokmål, Norwegian; Norwegian Bokmål"},
        "nd": {"en":"Ndebele, North; North Ndebele"},
        "ng": {"en":"Ndonga"},
        "nn": {"en":"Norwegian Nynorsk; Nynorsk, Norwegian"},
        "nr": {"en":"Ndebele, South; South Ndebele"},
        "nv": {"en":"Navajo; Navaho"},
        "ny": {"en":"Chichewa; Chewa; Nyanja"},
        "oj": {"en":"Ojibwa"},
        "os": {"en":"Ossetian; Ossetic"},
        "pi": {"en":"Pali"},
        "sc": {"en":"Sardinian"},
        "se": {"en":"Northern Sami"},
        "ty": {"en":"Tahitian"},
        "ve": {"en":"Venda"},
        "wa": {"en":"Walloon"},
        "za": {"en":"Zhuang; Chuang"}
    };

}(jQuery, this.i18next, this, document));