/****************************************************************************
load-phrases.js
****************************************************************************/

(function ($, i18next, window/*, document, undefined*/) {
    "use strict";

    //Create fcoo-namespace
    var ns = window.fcoo = window.fcoo || {};

    function getFileNameRec(fileName, subDir){
        if (arguments.length == 1){
            if (typeof arguments[0] == 'string')
                return arguments[0];
            else
                return arguments[0];
        }
        return {fileName: fileName, subDir: subDir};
    }


    function addPromise(fileName, resolve, context){
        ns.promiseList.append({
            fileName: fileName,
            resolve : $.proxy(resolve, context)
        });
    }


    /***************************************************************
    fcoo.loadKeyPhraseFile(fileName[, subDir]) OR ({fileName, subDir})
    Loads a key-phrase-files = { key: { namespace1: {..}, namespace2:{...} }*N }.
    See README.md for description of format
    ***************************************************************/
    ns.loadKeyPhraseFile = function(){
        addPromise(
            getFileNameRec.apply(null, arguments),
            i18next.addBundleKeyPhrases,
            i18next
        );
    };

    /***************************************************************
    fcoo.loadPhraseFile(fileName[, subDir]) OR ({fileName, subDir})
    Loads a phrase-files = { namespace: { key1: {..}, key2:{...} }*N }.
    See README.md for description of format
    ***************************************************************/
    ns.loadPhraseFile = function(){
        addPromise(
            getFileNameRec.apply(null, arguments),
            i18next.addBundlePhrases,
            i18next
        );
    };





}(jQuery, this.i18next, this, document));