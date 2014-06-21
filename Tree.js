define("Tree", ["jquery"], function($) {
    var JQUERY_PLUGIN_NAME = "tree";
    
    function Tree() {
        this.init.apply(this, arguments);
    }
    
    $.extend(Tree.prototype, {
        defaults: {}
        , init: function(options) {
            $.extend(true, this, this.defaults);
        }
    });
    
    // Зарегистрируем jquery плагин    
    $.fn[JQUERY_PLUGIN_NAME] = function(method) {
        var params = arguments;
        var result = undefined;
        this.each(function() {
            var element = $(this);
            if (!element.data(JQUERY_PLUGIN_NAME)) {
                element.data(JQUERY_PLUGIN_NAME, new Tree(method));
            }
            else if (element.data(JQUERY_PLUGIN_NAME)[method]) {
                result = element.data(JQUERY_PLUGIN_NAME)[method].apply(element.data(JQUERY_PLUGIN_NAME), Array.prototype.slice.call(params, 1));
                return result !== undefined ? false : true;
            }
            else {
                if (typeof method == "string" && element.data(JQUERY_PLUGIN_NAME)) {
                    $.error('Метод ' + method + ' не существует в jQuery.' + JQUERY_PLUGIN_NAME);
                }
            }
        });
        return result !== undefined ? result : this;
    };
    
    return Tree;
});