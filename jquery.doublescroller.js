/*!
 * jQuery doubleScroller Plugin
 * version: 1.0.0-2019.03.29
 * Requires jQuery v1.5 or later
 * Copyright (c) 2019 Tiac
 * https://github.com/Tiacx/jquery.doublescroller.js
 */

// AMD support
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // using AMD; register as anon module
        define(['jquery'], factory);
    } else {
        // no AMD; invoke directly
        factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
    }
}

(function($) {
"use strict";

/*
    Basic Usage:
    -----------

    JS:
        $('#grid-container').doubleScroller();
*/

$(document).mousemove(function(e) {
    if (!!this.move) {
        var posix = !document.move_target ? {'x': 0} : document.move_target.posix,
            callback = document.call_down || function() {
                $(this.move_target).css({
                    'left': Math.max(e.pageX - posix.x, 0)
                });
            };

        callback.call(this, e, posix);
        return false;
    }
}).mouseup(function(e) {
    if (!!this.move) {
        var callback = document.call_up || function(){};
        callback.call(this, e);
        $.extend(this, {
            'move': false,
            'move_target': null,
            'call_down': false,
            'call_up': false
        });
    }
});

$.fn.doubleScroller = function(options) {
    if(options===undefined) options = {};
    var defaults = {};
    options = $.extend(defaults, options);
    var _this = this;

    _this.css({overflow: 'hidden', position: 'relative', padding:'5px 0'});
    _this.prepend('<div class="db-scrollBarBox" style="top:0"><div class="db-scrollBar"></div></div>');
    _this.append('<div class="db-scrollBarBox" style="bottom:0"><div class="db-scrollBar"></div></div>');

    var _w  = _this.width();
    var _sw = _this.get(0).scrollWidth;
    var _ww = _w/_sw*_w;
    $('.db-scrollBarBox .db-scrollBar').css('width', _ww+'px');
    var minLeft = 0;
    var maxLeft = _w-_ww;

    $('.db-scrollBarBox .db-scrollBar').mousedown(function(e){
        var offset  = $(this).offset();
        var pOffset = $(this).parent().offset();
        this.posix  = {'x': e.pageX + pOffset.left - offset.left};
        $.extend(document, {'move': true, 'move_target': this, 'call_down': function(e){
            var _left = Math.max(e.pageX - this.move_target.posix.x, minLeft);
            _left = Math.min(maxLeft, _left);
            
            var _pp = $(this.move_target).parent().parent();
            _pp.scrollLeft(_left/(_w-_ww) * (_sw-_w));
            _pp.find('.db-scrollBar').css('left', _left);
            _pp.find('.db-scrollBarBox').css('left', _this.scrollLeft());
        }});
    });
};

}));
