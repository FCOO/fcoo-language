# fcoo-language
[Modernizr]: https://modernizr.com/
[lang-flag-icon]: https://github.com/FCOO/lang-flag-icon
[i18next]: http://i18next.com/
[jquery-i18next]: https://github.com/i18next/jquery-i18next
[i18next-intervalplural-postprocessor]: https://github.com/i18next/i18next-intervalplural-postprocessor

>CSS, JS-objects and interface to select language and translate text used by FCOO web applications


## Description
This package includes different packages and contains the css and JavaScript object to set media queries, device detection and set the tests by [Modernizr] needed:

- Set-up for [i18next] and plugins
- Set-up for [lang-flag-icon]


## Installation
### bower
`bower install https://github.com/FCOO/fcoo-language.git --save`

## Demo
http://FCOO.github.io/fcoo-language/demo/ 

Show list of all installed `flag-icon-XX` and `lang-icon-YY`


## name-space `window.fcoo`
All JavaScript objects are create in the name space `window.fcoo`

## [i18next]

### [i18next-intervalplural-postprocessor]
Post processor for i18next enabling interval plurals

    car_interval: '(1){one car};(2-7){a few cars};(7-inf){a lot of cars};',

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
