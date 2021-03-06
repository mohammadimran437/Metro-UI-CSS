var CharmsDefaultConfig = {
    charmsDeferred: 0,
    position: "right",
    opacity: 1,
    clsCharms: "",
    onCharmCreate: Metro.noop,
    onOpen: Metro.noop,
    onClose: Metro.noop,
    onToggle: Metro.noop
};

Metro.charmsSetup = function (options) {
    CharmsDefaultConfig = $.extend({}, CharmsDefaultConfig, options);
};

if (typeof window["metroCharmsSetup"] !== undefined) {
    Metro.charmsSetup(window["metroCharmsSetup"]);
}

var Charms = {
    name: "Charms",

    init: function( options, elem ) {
        this.options = $.extend( {}, CharmsDefaultConfig, options );
        this.elem  = elem;
        this.element = $(elem);
        this.origin = {
            background: ""
        };

        this._setOptionsFromDOM();
        Metro.createExec(this);

        return this;
    },

    _setOptionsFromDOM: function(){
        var element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var element = this.element, o = this.options;

        Metro.checkRuntime(element, "charms");

        this._createStructure();
        this._createEvents();

        Utils.exec(o.onCharmCreate, [element]);
        element.fire("charmcreate");
    },

    _createStructure: function(){
        var element = this.element, o = this.options;

        element
            .addClass("charms")
            .addClass(o.position + "-side")
            .addClass(o.clsCharms);

        this.origin.background = element.css("background-color");

        element.css({
            backgroundColor: Utils.computedRgbToRgba(Utils.getStyleOne(element, "background-color"), o.opacity)
        });
    },

    _createEvents: function(){
    },

    open: function(){
        var element = this.element, o = this.options;

        element.addClass("open");

        Utils.exec(o.onOpen, null, element[0]);
        element.fire("open");
    },

    close: function(){
        var element = this.element, o = this.options;

        element.removeClass("open");

        Utils.exec(o.onClose, null, element[0]);
        element.fire("close");
    },

    toggle: function(){
        var element = this.element, o = this.options;

        if (element.hasClass("open") === true) {
            this.close();
        } else {
            this.open();
        }

        Utils.exec(o.onToggle, null, element[0]);
        element.fire("toggle");
    },

    opacity: function(v){
        var element = this.element, o = this.options;

        if (v === undefined) {
            return o.opacity;
        }

        var opacity = Math.abs(parseFloat(v));
        if (opacity < 0 || opacity > 1) {
            return ;
        }
        o.opacity = opacity;
        element.css({
            backgroundColor: Utils.computedRgbToRgba(Utils.getStyleOne(element, "background-color"), opacity)
        });
    },

    changeOpacity: function(){
        var element = this.element;
        this.opacity(element.attr("data-opacity"));
    },

    changeAttribute: function(attributeName){
        switch (attributeName) {
            case "data-opacity": this.changeOpacity(); break;
        }
    },

    destroy: function(){
        return this.element;
    }
};

Metro.plugin('charms', Charms);

Metro['charms'] = {

    check: function(el){
        if (Utils.isMetroObject(el, "charms") === false) {
            console.warn("Element is not a charms component");
            return false;
        }
        return true;
    },

    isOpen: function(el){
        if (this.check(el) === false) return ;
        return $(el).hasClass("open");
    },

    open: function(el){
        if (this.check(el) === false) return ;
        Metro.getPlugin($(el)[0], "charms").open();
    },

    close: function(el){
        if (this.check(el) === false) return ;
        Metro.getPlugin($(el)[0], "charms").close();
    },

    toggle: function(el){
        if (this.check(el) === false) return ;
        Metro.getPlugin($(el)[0], "charms").toggle();
    },

    closeAll: function(){
        $('[data-role*=charms]').each(function() {
            Metro.getPlugin(this, 'charms').close();
        });
    },

    opacity: function(el, opacity){
        if (this.check(el) === false) return ;
        Metro.getPlugin($(el)[0], "charms").opacity(opacity);
    }
};