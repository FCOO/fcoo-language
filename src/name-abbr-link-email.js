/****************************************************************************
name-abbr-link-email.js

jQuery methods to create element with contents given by i18next-keys
ID:name, ID:abbr, ID:link, ID:email

****************************************************************************/

(function ($/*, i18next, window/*, document, undefined*/) {
    "use strict";

    //$.i18nLink(id) - Create a <a>-element with abbriviation (in <span>) and title and link (if exists)
    $.i18nLink = function( id ){
        return  $('<a/>')
                    .i18n('link:'+id, 'href', {defaultValue: null})
                    .i18n('name:'+id, 'title')
                    .append(
                        $('<span/>')
                            .i18n('abbr:'+id, {defaultValue: id.toUpperCase()} )
                    );
    };

}(jQuery, this.i18next, this, document));