# fcoo-language
[Modernizr]: https://modernizr.com/
[lang-flag-icon]: https://github.com/FCOO/lang-flag-icon
[i18next]: http://i18next.com/
[jquery-i18next]: https://github.com/i18next/jquery-i18next
[i18next-intervalplural-postprocessor]: https://github.com/i18next/i18next-intervalplural-postprocessor

>i18next, CSS, JS-objects and interface to select language and translate text used by FCOO web applications


## Description
FCOOs applications using [i18next] to translate.

This package includes set-up for [i18next] and other packages with css and JavaScript object to set language, icons and [Modernizr] tests.

## Installation
### bower
`bower install https://github.com/FCOO/fcoo-language.git --save`

## Demo
http://FCOO.github.io/fcoo-language/demo/ 

Show list of all installed `flag-icon-XX` and `lang-icon-YY`


## name-space `window.fcoo`
All JavaScript objects are create in the name space `window.fcoo`

## [i18next]

[i18next] is a *very popular internationalization library for browser or any other javascript environment*
It supports many different structure of organizing data and translations.
To unify and simplify the translation of text in FCOOs applications, the following options, structure, and methods are used and recommended.

### Available language

To change witch language that are available:
#### In `src/fcoo-language.js` change 

	var languages = ['da', 'en',...];

#### In `src/fcoo-language.scss` change

	$lang-list: ( 
  		da: dk, //Danish -> Denmark
		en: gb, //English -> UK
		...
	)

All translations, phrases etc. MUST always at least be available in Danish or English (but not necessarily in both)





### Selected language
`fcoo-language` will load selected language via [fcoo-settings](https://github.com/FCOO/fcoo-settings) or set a default language

The current language is always 
	
	i18next.language

And the event `"languagechanged"` in [fcoo.events](https://github.com/FCOO/fcoo-global-events) is fired when the language is changed.

### Alternative language
Some of the contents on FCOOs web applications are only available in either Danish (`da`) or English (`en`). 
If the user has selected a language other than `da` or `en` they select between `da` and `en` to be the second language (saved as `language2` in [fcoo-settings](https://github.com/FCOO/fcoo-settings))
This is primarily to allow users how has selected Faroese or Greenlandic to see no-translated contents in Danish.

`fcoo-language` also uses the browsers language as an options for alternative languages

It is also possible that some phrases are translated into languages not in the list of available languages. Eq. links to home-pages often are in national language and English

Event `"languagechanged"` is also fired when alternative language (`language2`) is changed

### Options
Using [default i18next options](http://i18next.com/docs/options/#init-options) for initializing i18next with one exception:
  	default namespace = `"translation"`
	namespace-key separator: `":"`
	key separator is changed to `"#"`

This makes it possible to use `"."` in keys eq. `link:fcoo.dk`

### Key and Namespace
[i18next] supports the use of multi level keys and namespace, but to keep it simple FCOOs applications will only use 1-dim keys and none or 1-dim namespace.
	i18next.t( "button:ok" ); 	//key="ok", namespace="button"
	i18next.t( "sealevel" );	//Key="sealevel", namespace=default

#### FCOO namespaces
The following namespaces are recommended to use:
- `link`: The link-address to a home-page. Use the address as key. Eq. key = `link:dmi.dk`, translation `da:"http://dmi.dk"`, `en:"http://dmi.dk/en"`
- `button`: Standard text to buttons. `button:close = {da: "Luk", en:"Close"}`
- `unit`: Physical units: Eq. `unit:metre = {da:"meter", en:"metre"}`
- `name`: Full name of institutions or organisations. Use national abbreviation as key and include name in national language. Eq. key = `name:bsh`, translation `en:"Federal Maritime and Hydrographic Agency", de:"Bundesamt für Seeschifffahrt und Hydrographie"`





### Adding translation
#### Default i18n structure
Default 1-dim json-structure for i18next is 

            { langA: { 
                namespace: { key: value1 }
              },
              langB: { 
                namespace: { key: value2 }
              }
            }
Using the following methods to add translations

	i18next.addResource(lng, ns, key, value, options) //Adds one key/value.
	i18next.addResources(lng, ns, resources) //Adds multiple key/values. 


#### Additional structure
To make adding translation easier a new format is supported: 

            { namespace: {
                key: {
                  langA: valueA,
                  langB: valueB
                }
            }

Tree methods are added to i18next:

	i18next.addPhrase( [namespace,] key, langValue) 
	i18next.addPhrases( [namespace,] keyLangValue )
	i18next.loadPhrases( jsonFileName, onFail );

Where 
- `key` {string} can be a combined namespace:key string, and
- `langValue` = `{ {lang: value}xN }`
- `keyLangValue` = `{ key: {lang: value}xN }, key2: {lang: value}xN } }`
- `jsonFileName` = the file name of a json-file with the format `nsKeyLangValue`
- `nsKeyLangValue` = 

		{ 
			namespaceA: { 
				key : {lang: value}xN }, 
				key2: {lang: value}xN } 
			},
		  	namespaceB: { 
				key3: {lang: value}xN }, 
				key4: {lang: value}xN } 
			}
		}
	

#### Example

	i18next.addPhrase( 'button:cancel', { en: 'Cancel', da:'Annuller' });
	//or
	i18next.addResource('en', 'button', 'cancel', 'Cancel');
	i18next.addResource('da', 'button', 'cancel', 'Annuller');

### Sentence
Sometime a translation is so local that it do not need to be added as a key.
E.g. in error-messages where the contents is specific to a given error

In these cases a new method is added to i18next:

	i18next.sentence( langValue, options )
	//or
	i18next.s( langValue, options )

Where  `langValue = { {lang: value}xN }`

#### Example

	var str = i18next.sentence({ en: 'This is a sentence in English', da:'Dette er en sætning på dansk' }); 


### Singular/Plural

`[KEY]` = Singular
`[KEY]_plural` = Plural

Translate with `options={count:...}`

#### Example

	{	"en": {
    		"translation": {
      			"key": "item",
      			"key_plural": "items",
      			"keyWithCount": "{{count}} item",
      			"keyWithCount_plural": "{{count}} items"
    		}
		}
	}

Would give the following translations

	i18next.t('key', {count: 0}); // output: 'items'
	i18next.t('key', {count: 1}); // output: 'item'
	i18next.t('key', {count: 5}); // output: 'items'
	i18next.t('key', {count: 100}); // output: 'items'
	i18next.t('keyWithCount', {count: 0}); // output: '0 items'
	i18next.t('keyWithCount', {count: 1}); // output: '1 item'
	i18next.t('keyWithCount', {count: 5}); // output: '5 items'
	i18next.t('keyWithCount', {count: 100}); // output: '100 items'


## i18next plugins

### [i18next-intervalplural-postprocessor]
Post processor for i18next enabling interval plurals

    i18next.addPhrase('car_interval', {
		en: '(1){one car};(2-7){a few cars};(7-inf){a lot of cars};',
		da: '(1){en bil};(2-7){et par biler};(7-inf){en masse biler};'
	});

    i18next.t('car_interval', { postProcess: 'interval', count: 1   }); // -> one car
    i18next.t('car_interval', { postProcess: 'interval', count: 4   }); // -> a few cars
    i18next.t('car_interval', { postProcess: 'interval', count: 100 }); // -> a lot of cars


### [jquery-i18next]
i18next plugin for jquery usage
Using property `"data-i18n"` to set the i18next-key

    <ul class="nav">
        <li><a href="#" data-i18n="nav.home"></a></li>
        <li><a href="#" data-i18n="nav.page1"></a></li>
        <li><a href="#" data-i18n="nav.page2"></a></li>
    </ul>

Also works for element properties

    <a id="btn1" href="#" data-i18n="[title]key.for.title"></a>

To update the contents call `localize`

    $("selector").localize([options]);

See [jqueryI18next] for documentation

## New jQuery prototype methods
To add or update the `data-i18n` properties of elements a new methods is defined

    $.fn.i18n( htmlOrKeyOrPhrase[, attribute][, options] )

Were `htmlOrKeyOrPhrase` = 
- simple html-string OR 
- i18next-key OR 
- a phrase-object (see langValue in i18next.addPhrase)
- 

that set or update `data-i18n="[attribute]key` and `data-i18n-options="options stringified"`

    $('<a href="#"></a>').i18n('car_interval', {count:5}); //<a href="#" data-i18n="car_interval" data-i18n-options="{'count':5}"/>

    $('<a href="#"></a>).i18n('key.for.title', 'title'); // <a href="#" data-i18n="[title]key.for.title"></a>


    $('<a href="#"></a>').i18n({'da':'På dansk', en:'In English'}); //<a href="#" data-i18n="SOM_TEMP_KEY"/>



----------

##  [lang-flag-icon]
The following classes is included.

### `flag-icon-XX`
Classes for `flag-icon-XX` for country-codes (XX)
- `dk` (Denmark)
- `fo` (Faro Islands)
- `gl` (Greenland) 

### `<html class="flag-XX> and show-for-flag-XX`
[Modernizr]-classes (`show-for-flag-XX` and `hide-for-flag-XX` for country-codes (XX)
- `dk` (Denmark)
- `fo` (Faro Islands)
- `gl` (Greenland) 
  
### `lang-icon-XX`
Classes for `lang-icon-XX` for language-codes (YY)
- `da` Danish -> Denmark
- `en` English -> UK
- `de` German -> Germany
- `sv` Swedish -> Sweden
- `no` Norwegian -> Norway
- `fo` Faroese -> Faroe Islands
- `kl` Kalaallisut/Greenlandic -> Greenland


### `<html class="lang-XX> and show-for-lang-YY`
[Modernizr]-classes (`show-for-lang-YY` and `hide-for-lang-YY` for language-codes (YY)
- `da` Danish
- `en` English
- `fo` Faroese
- `kl` Kalaallisut/Greenlandic


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/fcoo-language/LICENSE).

Copyright (c) 2015 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk
