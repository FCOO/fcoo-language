# fcoo-language
[Modernizr]: https://modernizr.com/
[lang-flag-icon]: https://github.com/FCOO/lang-flag-icon
[jquery-phrase-translator]: https://github.com/FCOO/jquery-phrase-translator

>CSS, JS-objects and interface to select language and translate text used by FCOO web applications


## Description
This package includes different packages and contains the css and JavaScript object to set media queries, device detection and set the tests by [Modernizr] needed:

- Set-up for [lang-flag-icon]
- Set-up for [jquery-phrase-translator] - **TODO**


## Installation
### bower
`bower install https://github.com/FCOO/fcoo-language.git --save`

## Demo
http://FCOO.github.io/fcoo-language/demo/ 

Show list of all installed `flag-icon-XX` and `lang-icon-YY`


## name-space `window.fcoo`
All JavaScript objects are create in the name space `window.fcoo`

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


## [jquery-phrase-translator]
**NOT INSTALLED**
(`jquery-phrase-translator": "fcoo/jquery-phrase-translator#^1.2.0"`)


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/fcoo-language/LICENSE).

Copyright (c) 2015 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk
