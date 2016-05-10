/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

var OpenLayers = {};

/** 
 * Header: OpenLayers Base Types
 * OpenLayers custom string, number and function functions are described here.
 */

/**
 * Namespace: OpenLayers.String
 * Contains convenience functions for string manipulation.
 */
OpenLayers.String = {

    /**
     * APIFunction: startsWith
     * Test whether a string starts with another string.
     *
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     *
     * Returns:
     * {Boolean} The first string starts with the second.
     */
    startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * Test whether a string contains another string.
     *
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     *
     * Returns:
     * {Boolean} The first string contains the second.
     */
    contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },

    /**
     * APIFunction: trim
     * Removes leading and trailing whitespace characters from a string.
     *
     * Parameters:
     * str - {String} The (potentially) space padded string.  This string is not
     *     modified.
     *
     * Returns:
     * {String} A trimmed version of the string with all leading and
     *     trailing spaces removed.
     */
    trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    /**
     * APIFunction: camelize
     * Camel-case a hyphenated string.
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} The string to be camelized.  The original is not modified.
     *
     * Returns:
     * {String} The string, camelized
     */
    camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i = 1, len = oStringList.length; i < len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },

    /**
     * APIFunction: format
     * Given a string with tokens in the form ${token}, return a string
     *     with tokens replaced with properties from the given context
     *     object.  Represent a literal "${" by doubling it, e.g. "${${".
     *
     * Parameters:
     * template - {String} A string with tokens to be replaced.  A template
     *     has the form "literal ${token}" where the token will be replaced
     *     by the value of context["token"].
     * context - {Object} An optional object with properties corresponding
     *     to the tokens in the format string.  If no context is sent, the
     *     window object will be used.
     * args - {Array} Optional arguments to pass to any functions found in
     *     the context.  If a context property is a function, the token
     *     will be replaced by the return from the function called with
     *     these arguments.
     *
     * Returns:
     * {String} A string with tokens replaced from the context object.
     */
    format: function(template, context, args) {

        // Example matching: 
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function(str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i = 0; i < subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }
                if (replacement === undefined) {
                    break;
                }
                replacement = replacement[subs[i]];
            }

            if (typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly 
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement;
            }
        };

        return template.replace(OpenLayers.String.tokenRegEx, replacer);
    },

    /**
     * Property: tokenRegEx
     * Used to find tokens in a string.
     * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
     */
    tokenRegEx: /\$\{([\w.]+?)\}/g,

    /**
     * Property: numberRegEx
     * Used to test strings as numbers.
     */
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,

    /**
     * APIFunction: isNumeric
     * Determine whether a string contains only a numeric value.
     *
     * Examples:
     * (code)
     * OpenLayers.String.isNumeric("6.02e23") // true
     * OpenLayers.String.isNumeric("12 dozen") // false
     * OpenLayers.String.isNumeric("4") // true
     * OpenLayers.String.isNumeric(" 4 ") // false
     * (end)
     *
     * Returns:
     * {Boolean} String contains only a number.
     */
    isNumeric: function(value) {
        return OpenLayers.String.numberRegEx.test(value);
    },

    /**
     * APIFunction: numericIf
     * Converts a string that appears to be a numeric value into a number.
     *
     * Parameters:
     * value - {String}
     * trimWhitespace - {Boolean}
     *
     * Returns:
     * {Number|String} a Number if the passed value is a number, a String
     *     otherwise.
     */
    numericIf: function(value, trimWhitespace) {
        var originalValue = value;
        if (trimWhitespace === true && value != null && value.replace) {
            value = value.replace(/^\s*|\s*$/g, "");
        }
        return OpenLayers.String.isNumeric(value) ? parseFloat(value) : originalValue;
    }

};

/**
 * Namespace: OpenLayers.Number
 * Contains convenience functions for manipulating numbers.
 */
OpenLayers.Number = {

    /**
     * Property: decimalSeparator
     * Decimal separator to use when formatting numbers.
     */
    decimalSeparator: ".",

    /**
     * Property: thousandsSeparator
     * Thousands separator to use when formatting numbers.
     */
    thousandsSeparator: ",",

    /**
     * APIFunction: limitSigDigs
     * Limit the number of significant digits on a float.
     *
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     *
     * Returns:
     * {Float} The number, rounded to the specified number of significant
     *     digits.
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },

    /**
     * APIFunction: format
     * Formats a number for output.
     *
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} Number of decimal places to round to.
     *        Defaults to 0. Set to null to leave decimal places unchanged.
     * tsep - {String} Thousands separator.
     *        Default is ",".
     * dsep - {String} Decimal separator.
     *        Default is ".".
     *
     * Returns:
     * {String} A string representing the formatted number.
     */
    format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0;
        tsep = (typeof tsep != "undefined") ? tsep :
            OpenLayers.Number.thousandsSeparator;
        dsep = (typeof dsep != "undefined") ? dsep :
            OpenLayers.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }

        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/;
            while (thousands.test(integer)) {
                integer = integer.replace(thousands, "$1" + tsep + "$2");
            }
        }

        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    },

    /**
     * Method: zeroPad
     * Create a zero padded string optionally with a radix for casting numbers.
     *
     * Parameters:
     * num - {Number} The number to be zero padded.
     * len - {Number} The length of the string to be returned.
     * radix - {Number} An integer between 2 and 36 specifying the base to use
     *     for representing numeric values.
     */
    zeroPad: function(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }
};

/**
 * Namespace: OpenLayers.Function
 * Contains convenience functions for function manipulation.
 */
OpenLayers.Function = {
    /**
     * APIFunction: bind
     * Bind a function to an object.  Method to easily create closures with
     *     'this' altered.
     *
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     *
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },

    /**
     * APIFunction: bindAsEventListener
     * Bind a function to an object, and configure it to receive the event
     *     object as first parameter when called.
     *
     * Parameters:
     * func - {Function} Input function to serve as an event listener.
     * object - {Object} A reference to this.
     *
     * Returns:
     * {Function}
     */

    /**
     * APIFunction: False
     * A simple function to that just does "return false". We use this to
     * avoid attaching anonymous functions to DOM event handlers, which
     * causes "issues" on IE<8.
     *
     * Usage:
     * document.onclick = OpenLayers.Function.False;
     *
     * Returns:
     * {Boolean}
     */
    False: function() {
        return false;
    },

    /**
     * APIFunction: True
     * A simple function to that just does "return true". We use this to
     * avoid attaching anonymous functions to DOM event handlers, which
     * causes "issues" on IE<8.
     *
     * Usage:
     * document.onclick = OpenLayers.Function.True;
     *
     * Returns:
     * {Boolean}
     */
    True: function() {
        return true;
    },

    /**
     * APIFunction: Void
     * A reusable function that returns ``undefined``.
     *
     * Returns:
     * {undefined}
     */
    Void: function() {}

};

/**
 * Namespace: OpenLayers.Array
 * Contains convenience functions for array manipulation.
 */
OpenLayers.Array = {

    /**
     * APIMethod: filter
     * Filter an array.  Provides the functionality of the
     *     Array.prototype.filter extension to the ECMA-262 standard.  Where
     *     available, Array.prototype.filter will be used.
     *
     * Based on well known example from http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
     *
     * Parameters:
     * array - {Array} The array to be filtered.  This array is not mutated.
     *     Elements added to this array by the callback will not be visited.
     * callback - {Function} A function that is called for each element in
     *     the array.  If this function returns true, the element will be
     *     included in the return.  The function will be called with three
     *     arguments: the element in the array, the index of that element, and
     *     the array itself.  If the optional caller parameter is specified
     *     the callback will be called with this set to caller.
     * caller - {Object} Optional object to be set as this when the callback
     *     is called.
     *
     * Returns:
     * {Array} An array of elements from the passed in array for which the
     *     callback returns true.
     */
    filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for (var i = 0; i < len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }
        }
        return selected;
    }

};



/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for
 *     multiple inheritance.
 *
 * This constructor is new in OpenLayers 2.5.  At OpenLayers 3.0, the old
 *     syntax for creating classes and dealing with inheritance
 *     will be removed.
 *
 * To create a new OpenLayers-style class, use the following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(prototype);
 * (end)
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 * (end)
 *
 * Note that instanceof reflection will only reveal Class1 as superclass.
 *
 */
OpenLayers.Class = function() {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len - 1];

    var C = typeof F.initialize == "function" ?
        F.initialize :
        function() {
            P.prototype.initialize.apply(this, arguments);
        };

    if (len > 1) {
        var newArgs = [C, P].concat(
            Array.prototype.slice.call(arguments).slice(1, len - 1), F);
        OpenLayers.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};



/**
 * Function: OpenLayers.inherit
 *
 * Parameters:
 * C - {Object} the class that inherits
 * P - {Object} the superclass to inherit from
 *
 * In addition to the mandatory C and P parameters, an arbitrary number of
 * objects can be passed, which will extend C.
 */
OpenLayers.inherit = function(C, P) {
    var F = function() {};
    F.prototype = P.prototype;
    C.prototype = new F;
    var i, l, o;
    for (i = 2, l = arguments.length; i < l; i++) {
        o = arguments[i];
        if (typeof o === "function") {
            o = o.prototype;
        }
        OpenLayers.Util.extend(C.prototype, o);
    }
};

/**
 * APIFunction: extend
 * Copy all properties of a source object to a destination object.  Modifies
 *     the passed in destination object.  Any properties on the source object
 *     that are set to undefined will not be (re)set on the destination object.
 *
 * Parameters:
 * destination - {Object} The object that will be modified
 * source - {Object} The object with properties to be set on the destination
 *
 * Returns:
 * {Object} The destination object.
 */
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

    }
    return destination;
};




/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Console.js
 */

/**
 * Namespace: OpenLayers.Lang
 * Internationalization namespace.  Contains dictionaries in various languages
 *     and methods to set and get the current language.
 */
OpenLayers.Lang = {

    /** 
     * Property: code
     * {String}  Current language code to use in OpenLayers.  Use the
     *     <setCode> method to set this value and the <getCode> method to
     *     retrieve it.
     */
    code: null,

    /** 
     * APIProperty: defaultCode
     * {String} Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultCode: "en",

    /**
     * APIFunction: getCode
     * Get the current language code.
     *
     * Returns:
     * {String} The current language code.
     */
    getCode: function() {
        if (!OpenLayers.Lang.code) {
            OpenLayers.Lang.setCode();
        }
        return OpenLayers.Lang.code;
    },

    /**
     * APIFunction: setCode
     * Set the language code for string translation.  This code is used by
     *     the <OpenLayers.Lang.translate> method.
     *
     * Parameters:
     * code - {String} These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt.  If no value is set, the
     *     browser's language setting will be tested.  If no <OpenLayers.Lang>
     *     dictionary exists for the code, the <OpenLayers.String.defaultLang>
     *     will be used.
     */
    setCode: function(code) {
        var lang;
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        if (typeof OpenLayers.Lang[parts[0]] == "object") {
            lang = parts[0];
        }

        // check for regional extensions
        if (parts[1]) {
            var testLang = parts[0] + '-' + parts[1].toUpperCase();
            if (typeof OpenLayers.Lang[testLang] == "object") {
                lang = testLang;
            }
        }
        if (!lang) {
            OpenLayers.Console.warn(
                'Failed to find OpenLayers.Lang.' + parts.join("-") +
                ' dictionary, falling back to default language'
            );
            lang = OpenLayers.Lang.defaultCode;
        }

        OpenLayers.Lang.code = lang;
    },

    /**
     * APIMethod: translate
     * Looks up a key from a dictionary based on the current language string.
     *     The value of <getCode> will be used to determine the appropriate
     *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
     *
     * Parameters:
     * key - {String} The key for an i18n string value in the dictionary.
     * context - {Object} Optional context to be used with
     *     <OpenLayers.String.format>.
     *
     * Returns:
     * {String} A internationalized string.
     */
    translate: function(key, context) {
        var dictionary = OpenLayers.Lang[OpenLayers.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if (!message) {
            // Message not found, fall back to message key
            message = key;
        }
        if (context) {
            message = OpenLayers.String.format(message, context);
        }
        return message;
    }

};

/**
 * APIMethod: OpenLayers.i18n
 * Alias for <OpenLayers.Lang.translate>.  Looks up a key from a dictionary
 *     based on the current language string. The value of
 *     <OpenLayers.Lang.getCode> will be used to determine the appropriate
 *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
 *
 * Parameters:
 * key - {String} The key for an i18n string value in the dictionary.
 * context - {Object} Optional context to be used with
 *     <OpenLayers.String.format>.
 *
 * Returns:
 * {String} A internationalized string.
 */
OpenLayers.i18n = OpenLayers.Lang.translate;



/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/BaseTypes/Bounds.js
 * @requires OpenLayers/BaseTypes/Element.js
 * @requires OpenLayers/BaseTypes/LonLat.js
 * @requires OpenLayers/BaseTypes/Pixel.js
 * @requires OpenLayers/BaseTypes/Size.js
 * @requires OpenLayers/Lang.js
 */

/**
 * Namespace: Util
 */
OpenLayers.Util = OpenLayers.Util || {};

/** 
 * Function: getElement
 * This is the old $() from prototype
 *
 * Parameters:
 * e - {String or DOMElement or Window}
 *
 * Returns:
 * {Array(DOMElement) or DOMElement}
 */
OpenLayers.Util.getElement = function() {
    var elements = [];

    for (var i = 0, len = arguments.length; i < len; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

/**
 * Function: isElement
 * A cross-browser implementation of "e instanceof Element".
 *
 * Parameters:
 * o - {Object} The object to test.
 *
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.isElement = function(o) {
    return !!(o && o.nodeType === 1);
};

/**
 * Function: isArray
 * Tests that the provided object is an array.
 * This test handles the cross-IFRAME case not caught
 * by "a instanceof Array" and should be used instead.
 *
 * Parameters:
 * a - {Object} the object test.
 *
 * Returns:
 * {Boolean} true if the object is an array.
 */
OpenLayers.Util.isArray = function(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
};

/** 
 * Function: removeItem
 * Remove an object from an array. Iterates through the array
 *     to find the item, then removes it.
 *
 * Parameters:
 * array - {Array}
 * item - {Object}
 *
 * Returns:
 * {Array} A reference to the array
 */
OpenLayers.Util.removeItem = function(array, item) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
            //break;more than once??
        }
    }
    return array;
};

/** 
 * Function: indexOf
 * Seems to exist already in FF, but not in MOZ.
 *
 * Parameters:
 * array - {Array}
 * obj - {*}
 *
 * Returns:
 * {Integer} The index at which the first object was found in the array.
 *           If not found, returns -1.
 */
OpenLayers.Util.indexOf = function(array, obj) {
    // use the build-in function if available.
    if (typeof array.indexOf == "function") {
        return array.indexOf(obj);
    } else {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == obj) {
                return i;
            }
        }
        return -1;
    }
};


/**
 * Property: dotless
 * {RegExp}
 * Compiled regular expression to match dots (".").  This is used for replacing
 *     dots in identifiers.  Because object identifiers are frequently used for
 *     DOM element identifiers by the library, we avoid using dots to make for
 *     more sensible CSS selectors.
 *
 * TODO: Use a module pattern to avoid bloating the API with stuff like this.
 */
OpenLayers.Util.dotless = /\./g;

/**
 * Function: modifyDOMElement
 *
 * Modifies many properties of a DOM element all at once.  Passing in
 * null to an individual parameter will avoid setting the attribute.
 *
 * Parameters:
 * element - {DOMElement} DOM element to modify.
 * id - {String} The element id attribute to set.  Note that dots (".") will be
 *     replaced with underscore ("_") in setting the element id.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * position - {String}       The position attribute.  eg: absolute,
 *                           relative, etc.
 * border - {String}         The style.border attribute.  eg:
 *                           solid black 2px
 * overflow - {String}       The style.overview attribute.
 * opacity - {Float}         Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position,
    border, overflow, opacity) {

    if (id) {
        element.id = id.replace(OpenLayers.Util.dotless, "_");
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};

/** 
 * Function: createDiv
 * Creates a new div and optionally set some standard attributes.
 * Null may be passed to each parameter if you do not wish to
 * set a particular attribute.
 * Note - zIndex is NOT set on the resulting div.
 *
 * Parameters:
 * id - {String} An identifier for this element.  If no id is
 *               passed an identifier will be created
 *               automatically.  Note that dots (".") will be replaced with
 *               underscore ("_") when generating ids.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} A url pointing to an image to use as a
 *                   background image.
 * position - {String} The style.position value. eg: absolute,
 *                     relative etc.
 * border - {String} The the style.border value.
 *                   eg: 2px solid black
 * overflow - {String} The style.overflow value. Eg. hidden
 * opacity - {Float} Fractional value (0.0 - 1.0)
 *
 * Returns:
 * {DOMElement} A DOM Div created with the specified attributes.
 */
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position,
    border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position,
        border, overflow, opacity);

    return dom;
};

/**
 * Function: createImage
 * Creates an img element with specific attribute values.
 *
 * Parameters:
 * id - {String} The id field for the img.  If none assigned one will be
 *               automatically generated.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} The url to use as the image source.
 * position - {String} The style.position value.
 * border - {String} The border to place around the image.
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 *
 * Returns:
 * {DOMElement} A DOM Image created with the specified attributes.
 */
OpenLayers.Util.createImage = function(id, px, sz, imgURL, position, border,
    opacity, delayDisplay) {

    var image = document.createElement("img");

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position,
        border, null, opacity);

    if (delayDisplay) {
        image.style.display = "none";

        function display() {
            image.style.display = "";
            OpenLayers.Event.stopObservingElement(image);
        }
        OpenLayers.Event.observe(image, "load", display);
        OpenLayers.Event.observe(image, "error", display);
    }

    //set special properties
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }

    return image;
};

/**
 * Property: IMAGE_RELOAD_ATTEMPTS
 * {Integer} How many times should we try to reload an image before giving up?
 *           Default is 0
 */
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;

/**
 * Property: alphaHackNeeded
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHackNeeded = null;

/**
 * Function: alphaHack
 * Checks whether it's necessary (and possible) to use the png alpha
 * hack which allows alpha transparency for png images under Internet
 * Explorer.
 *
 * Returns:
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHack = function() {
    if (OpenLayers.Util.alphaHackNeeded == null) {
        var filter = false;

        // IEs4Lin dies when trying to access document.body.filters, because 
        // the property is there, but requires a DLL that can't be provided. This
        // means that we need to wrap this in a try/catch so that this can
        // continue.

        try {
            filter = !!(document.body.filters);
        } catch (e) {}

        OpenLayers.Util.alphaHackNeeded = (filter &&
            (version >= 5.5) && (version < 7));
    }
    return OpenLayers.Util.alphaHackNeeded;
};

/** 
 * Function: modifyAlphaImageDiv
 *
 * Parameters:
 * div - {DOMElement} Div containing Alpha-adjusted Image
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL,
    position, border, sizing,
    opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz, position,
        null, null, opacity);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz,
        "relative", border);

    if (OpenLayers.Util.alphaHack()) {
        if (div.style.display != "none") {
            div.style.display = "inline-block";
        }
        if (sizing == null) {
            sizing = "scale";
        }

        div.style.filter = "progid:DXImageTransform.Microsoft" +
            ".AlphaImageLoader(src='" + img.src + "', " +
            "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 &&
            parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "alpha(opacity=0)";
    }
};

/** 
 * Function: createAlphaImageDiv
 *
 * Parameters:
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 *
 * Returns:
 * {DOMElement} A DOM Div created with a DOM Image inside it. If the hack is
 *              needed for transparency in IE, it is added.
 */
OpenLayers.Util.createAlphaImageDiv = function(id, px, sz, imgURL,
    position, border, sizing,
    opacity, delayDisplay) {

    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null,
        null, delayDisplay);
    img.className = "olAlphaImg";
    div.appendChild(img);

    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position,
        border, sizing, opacity);

    return div;
};


/** 
 * Function: upperCaseObject
 * Creates a new hashtable and copies over all the keys from the
 *     passed-in object, but storing them under an uppercased
 *     version of the key at which they were stored.
 *
 * Parameters:
 * object - {Object}
 *
 * Returns:
 * {Object} A new Object with all the same keys but uppercased
 */
OpenLayers.Util.upperCaseObject = function(object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

/** 
 * Function: applyDefaults
 * Takes an object and copies any properties that don't exist from
 *     another properties, by analogy with OpenLayers.Util.extend() from
 *     Prototype.js.
 *
 * Parameters:
 * to - {Object} The destination object.
 * from - {Object} The source object.  Any properties of this object that
 *     are undefined in the to object will be set on the to object.
 *
 * Returns:
 * {Object} A reference to the to object.  Note that the to argument is modified
 *     in place and returned by this function.
 */
OpenLayers.Util.applyDefaults = function(to, from) {
    to = to || {};
    /*
     * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
     * prototype object" when calling hawOwnProperty if the source object is an
     * instance of window.Event.
     */
    var fromIsEvt = typeof window.Event == "function" && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    /**
     * IE doesn't include the toString property when iterating over an object's
     * properties with the for(property in object) syntax.  Explicitly check if
     * the source has its own toString property.
     */
    if (!fromIsEvt && from && from.hasOwnProperty && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }

    return to;
};

/**
 * Function: getParameterString
 *
 * Parameters:
 * params - {Object}
 *
 * Returns:
 * {String} A concatenation of the properties of an object in
 *          http parameter notation.
 *          (ex. <i>"key1=value1&key2=value2&key3=value3"</i>)
 *          If a parameter is actually a list, that parameter will then
 *          be set to a comma-seperated list of values (foo,bar) instead
 *          of being URL escaped (foo%3Abar).
 */
OpenLayers.Util.getParameterString = function(params) {
    var paramsArray = [];

    for (var key in params) {
        var value = params[key];
        if ((value != null) && (typeof value != 'function')) {
            var encodedValue;
            if (typeof value == 'object' && value.constructor == Array) {
                /* value is an array; encode items and separate with "," */
                var encodedItemArray = [];
                var item;
                for (var itemIndex = 0, len = value.length; itemIndex < len; itemIndex++) {
                    item = value[itemIndex];
                    encodedItemArray.push(encodeURIComponent(
                        (item === null || item === undefined) ? "" : item));
                }
                encodedValue = encodedItemArray.join(",");
            } else {
                /* value is a string; simply encode */
                encodedValue = encodeURIComponent(value);
            }
            paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
        }
    }

    return paramsArray.join("&");
};

/**
 * Function: urlAppend
 * Appends a parameter string to a url. This function includes the logic for
 * using the appropriate character (none, & or ?) to append to the url before
 * appending the param string.
 *
 * Parameters:
 * url - {String} The url to append to
 * paramStr - {String} The param string to append
 *
 * Returns:
 * {String} The new url
 */
OpenLayers.Util.urlAppend = function(url, paramStr) {
    var newUrl = url;
    if (paramStr) {
        var parts = (url + " ").split(/[?&]/);
        newUrl += (parts.pop() === " " ?
            paramStr :
            parts.length ? "&" + paramStr : "?" + paramStr);
    }
    return newUrl;
};

/** 
 * Function: getImagesLocation
 *
 * Returns:
 * {String} The fully formatted image location string
 */
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};

/** 
 * Function: getImageLocation
 *
 * Returns:
 * {String} The fully formatted location string for a specified image
 */
OpenLayers.Util.getImageLocation = function(image) {
    return OpenLayers.Util.getImagesLocation() + image;
};


/** 
 * Function: Try
 * Execute functions until one of them doesn't throw an error.
 *     Capitalized because "try" is a reserved word in JavaScript.
 *     Taken directly from OpenLayers.Util.Try()
 *
 * Parameters:
 * [*] - {Function} Any number of parameters may be passed to Try()
 *    It will attempt to execute each of them until one of them
 *    successfully executes.
 *    If none executes successfully, returns null.
 *
 * Returns:
 * {*} The value returned by the first successfully executed function.
 */
OpenLayers.Util.Try = function() {
    var returnValue = null;

    for (var i = 0, len = arguments.length; i < len; i++) {
        var lambda = arguments[i];
        try {
            returnValue = lambda();
            break;
        } catch (e) {}
    }

    return returnValue;
};

/**
 * Function: getXmlNodeValue
 *
 * Parameters:
 * node - {XMLNode}
 *
 * Returns:
 * {String} The text value of the given node, without breaking in firefox or IE
 */
OpenLayers.Util.getXmlNodeValue = function(node) {
    var val = null;
    OpenLayers.Util.Try(
        function() {
            val = node.text;
            if (!val) {
                val = node.textContent;
            }
            if (!val) {
                val = node.firstChild.nodeValue;
            }
        },
        function() {
            val = node.textContent;
        });
    return val;
};

/** 
 * Function: mouseLeft
 *
 * Parameters:
 * evt - {Event}
 * div - {HTMLDivElement}
 *
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.mouseLeft = function(evt, div) {
    // start with the element to which the mouse has moved
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    // walk up the DOM tree.
    while (target != div && target != null) {
        target = target.parentNode;
    }
    // if the target we stop at isn't the div, then we've left the div.
    return (target != div);
};

/**
 * Property: precision
 * {Number} The number of significant digits to retain to avoid
 * floating point precision errors.
 *
 * We use 14 as a "safe" default because, although IEEE 754 double floats
 * (standard on most modern operating systems) support up to about 16
 * significant digits, 14 significant digits are sufficient to represent
 * sub-millimeter accuracy in any coordinate system that anyone is likely to
 * use with OpenLayers.
 *
 * If DEFAULT_PRECISION is set to 0, the original non-truncating behavior
 * of OpenLayers <2.8 is preserved. Be aware that this will cause problems
 * with certain projections, e.g. spherical Mercator.
 *
 */
OpenLayers.Util.DEFAULT_PRECISION = 14;

/**
 * Function: toFloat
 * Convenience method to cast an object to a Number, rounded to the
 * desired floating point precision.
 *
 * Parameters:
 * number    - {Number} The number to cast and round.
 * precision - {Number} An integer suitable for use with
 *      Number.toPrecision(). Defaults to OpenLayers.Util.DEFAULT_PRECISION.
 *      If set to 0, no rounding is performed.
 *
 * Returns:
 * {Number} The cast, rounded number.
 */
OpenLayers.Util.toFloat = function(number, precision) {
    if (precision == null) {
        precision = OpenLayers.Util.DEFAULT_PRECISION;
    }
    if (typeof number !== "number") {
        number = parseFloat(number);
    }
    return precision === 0 ? number :
        parseFloat(number.toPrecision(precision));
};

/**
 * Function: rad
 *
 * Parameters:
 * x - {Float}
 *
 * Returns:
 * {Float}
 */
OpenLayers.Util.rad = function(x) {
    return x * Math.PI / 180;
};

/**
 * Function: deg
 *
 * Parameters:
 * x - {Float}
 *
 * Returns:
 * {Float}
 */
OpenLayers.Util.deg = function(x) {
    return x * 180 / Math.PI;
};

/**
 * Property: VincentyConstants
 * {Object} Constants for Vincenty functions.
 */
OpenLayers.Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
};

/**
 * APIFunction: distVincenty
 * Given two objects representing points with geographic coordinates, this
 *     calculates the distance between those points on the surface of an
 *     ellipsoid.
 *
 * Parameters:
 * p1 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 * p2 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 *
 * Returns:
 * {Float} The distance (in km) between the two input points as measured on an
 *     ellipsoid.  Note that the input point objects must be in geographic
 *     coordinates (decimal degrees) and the return distance is in kilometers.
 */
OpenLayers.Util.distVincenty = function(p1, p2) {
    var ct = OpenLayers.Util.VincentyConstants;
    var a = ct.a,
        b = ct.b,
        f = ct.f;

    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1 - f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1 - f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1),
        cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2),
        cosU2 = Math.cos(U2);
    var lambda = L,
        lambdaP = 2 * Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
        var sinLambda = Math.sin(lambda),
            cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if (sinSigma == 0) {
            return 0; // co-incident points
        }
        var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * Math.sin(alpha) *
            (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    if (iterLimit == 0) {
        return NaN; // formula failed to converge
    }
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    var s = b * A * (sigma - deltaSigma);
    var d = s.toFixed(3) / 1000; // round to 1mm precision
    return d;
};

/**
 * APIFunction: destinationVincenty
 * Calculate destination point given start point lat/long (numeric degrees),
 * bearing (numeric degrees) & distance (in m).
 * Adapted from Chris Veness work, see
 * http://www.movable-type.co.uk/scripts/latlong-vincenty-direct.html
 *
 * Parameters:
 * lonlat  - {<OpenLayers.LonLat>} (or any object with both .lat, .lon
 *     properties) The start point.
 * brng     - {Float} The bearing (degrees).
 * dist     - {Float} The ground distance (meters).
 *
 * Returns:
 * {<OpenLayers.LonLat>} The destination point.
 */
OpenLayers.Util.destinationVincenty = function(lonlat, brng, dist) {
    var u = OpenLayers.Util;
    var ct = u.VincentyConstants;
    var a = ct.a,
        b = ct.b,
        f = ct.f;

    var lon1 = lonlat.lon;
    var lat1 = lonlat.lat;

    var s = dist;
    var alpha1 = u.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);

    var tanU1 = (1 - f) * Math.tan(u.rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)),
        sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    var sigma = s / (b * A),
        sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

    var revAz = Math.atan2(sinAlpha, -tmp); // final bearing

    return new OpenLayers.LonLat(lon1 + u.deg(L), u.deg(lat2));
};

/**
 * Function: getParameters
 * Parse the parameters from a URL or from the current page itself into a
 *     JavaScript Object. Note that parameter values with commas are separated
 *     out into an Array.
 *
 * Parameters:
 * url - {String} Optional url used to extract the query string.
 *                If url is null or is not supplied, query string is taken
 *                from the page location.
 * options - {Object} Additional options. Optional.
 *
 * Valid options:
 *   splitArgs - {Boolean} Split comma delimited params into arrays? Default is
 *       true.
 *
 * Returns:
 * {Object} An object of key/value pairs from the query string.
 */
OpenLayers.Util.getParameters = function(url, options) {
    options = options || {};
    // if no url specified, take it from the location bar
    url = (url === null || url === undefined) ? window.location.href : url;

    //parse out parameters portion of url string
    var paramsString = "";
    if (OpenLayers.String.contains(url, '?')) {
        var start = url.indexOf('?') + 1;
        var end = OpenLayers.String.contains(url, "#") ?
            url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }

    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for (var i = 0, len = pairs.length; i < len; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {

            var key = keyValue[0];
            try {
                key = decodeURIComponent(key);
            } catch (err) {
                key = unescape(key);
            }

            // being liberal by replacing "+" with " "
            var value = (keyValue[1] || '').replace(/\+/g, " ");

            try {
                value = decodeURIComponent(value);
            } catch (err) {
                value = unescape(value);
            }

            // follow OGC convention of comma delimited values
            if (options.splitArgs !== false) {
                value = value.split(",");
            }

            //if there's only one value, do not return as array                    
            if (value.length == 1) {
                value = value[0];
            }

            parameters[key] = value;
        }
    }
    return parameters;
};

/**
 * Property: lastSeqID
 * {Integer} The ever-incrementing count variable.
 *           Used for generating unique ids.
 */
OpenLayers.Util.lastSeqID = 0;

/**
 * Function: createUniqueID
 * Create a unique identifier for this session.  Each time this function
 *     is called, a counter is incremented.  The return will be the optional
 *     prefix (defaults to "id_") appended with the counter value.
 *
 * Parameters:
 * prefix - {String} Optional string to prefix unique id. Default is "id_".
 *     Note that dots (".") in the prefix will be replaced with underscore ("_").
 *
 * Returns:
 * {String} A unique id string, built on the passed in prefix.
 */
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    } else {
        prefix = prefix.replace(OpenLayers.Util.dotless, "_");
    }
    OpenLayers.Util.lastSeqID += 1;
    return prefix + OpenLayers.Util.lastSeqID;
};

/**
 * Constant: INCHES_PER_UNIT
 * {Object} Constant inches per unit -- borrowed from MapServer mapscale.c
 * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
 * Includes the full set of units supported by CS-MAP (http://trac.osgeo.org/csmap/)
 * and PROJ.4 (http://trac.osgeo.org/proj/)
 * The hardcoded table is maintain in a CS-MAP source code module named CSdataU.c
 * The hardcoded table of PROJ.4 units are in pj_units.c.
 */
OpenLayers.INCHES_PER_UNIT = {
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.37,
    'km': 39370,
    'dd': 4374754,
    'yd': 36
};
OpenLayers.INCHES_PER_UNIT["in"] = OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"] = 1852 * OpenLayers.INCHES_PER_UNIT.m;

// Units from CS-Map
OpenLayers.METERS_PER_INCH = 0.02540005080010160020;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "Inch": OpenLayers.INCHES_PER_UNIT.inches,
    "Meter": 1.0 / OpenLayers.METERS_PER_INCH, //EPSG:9001
    "Foot": 0.30480060960121920243 / OpenLayers.METERS_PER_INCH, //EPSG:9003
    "IFoot": 0.30480000000000000000 / OpenLayers.METERS_PER_INCH, //EPSG:9002
    "ClarkeFoot": 0.3047972651151 / OpenLayers.METERS_PER_INCH, //EPSG:9005
    "SearsFoot": 0.30479947153867624624 / OpenLayers.METERS_PER_INCH, //EPSG:9041
    "GoldCoastFoot": 0.30479971018150881758 / OpenLayers.METERS_PER_INCH, //EPSG:9094
    "IInch": 0.02540000000000000000 / OpenLayers.METERS_PER_INCH,
    "MicroInch": 0.00002540000000000000 / OpenLayers.METERS_PER_INCH,
    "Mil": 0.00000002540000000000 / OpenLayers.METERS_PER_INCH,
    "Centimeter": 0.01000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Kilometer": 1000.00000000000000000000 / OpenLayers.METERS_PER_INCH, //EPSG:9036
    "Yard": 0.91440182880365760731 / OpenLayers.METERS_PER_INCH,
    "SearsYard": 0.914398414616029 / OpenLayers.METERS_PER_INCH, //EPSG:9040
    "IndianYard": 0.91439853074444079983 / OpenLayers.METERS_PER_INCH, //EPSG:9084
    "IndianYd37": 0.91439523 / OpenLayers.METERS_PER_INCH, //EPSG:9085
    "IndianYd62": 0.9143988 / OpenLayers.METERS_PER_INCH, //EPSG:9086
    "IndianYd75": 0.9143985 / OpenLayers.METERS_PER_INCH, //EPSG:9087
    "IndianFoot": 0.30479951 / OpenLayers.METERS_PER_INCH, //EPSG:9080
    "IndianFt37": 0.30479841 / OpenLayers.METERS_PER_INCH, //EPSG:9081
    "IndianFt62": 0.3047996 / OpenLayers.METERS_PER_INCH, //EPSG:9082
    "IndianFt75": 0.3047995 / OpenLayers.METERS_PER_INCH, //EPSG:9083
    "Mile": 1609.34721869443738887477 / OpenLayers.METERS_PER_INCH,
    "IYard": 0.91440000000000000000 / OpenLayers.METERS_PER_INCH, //EPSG:9096
    "IMile": 1609.34400000000000000000 / OpenLayers.METERS_PER_INCH, //EPSG:9093
    "NautM": 1852.00000000000000000000 / OpenLayers.METERS_PER_INCH, //EPSG:9030
    "Lat-66": 110943.316488932731 / OpenLayers.METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / OpenLayers.METERS_PER_INCH,
    "Decimeter": 0.10000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Millimeter": 0.00100000000000000000 / OpenLayers.METERS_PER_INCH,
    "Dekameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Decameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Hectometer": 100.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "GermanMeter": 1.0000135965 / OpenLayers.METERS_PER_INCH, //EPSG:9031
    "CaGrid": 0.999738 / OpenLayers.METERS_PER_INCH,
    "ClarkeChain": 20.1166194976 / OpenLayers.METERS_PER_INCH, //EPSG:9038
    "GunterChain": 20.11684023368047 / OpenLayers.METERS_PER_INCH, //EPSG:9033
    "BenoitChain": 20.116782494375872 / OpenLayers.METERS_PER_INCH, //EPSG:9062
    "SearsChain": 20.11676512155 / OpenLayers.METERS_PER_INCH, //EPSG:9042
    "ClarkeLink": 0.201166194976 / OpenLayers.METERS_PER_INCH, //EPSG:9039
    "GunterLink": 0.2011684023368047 / OpenLayers.METERS_PER_INCH, //EPSG:9034
    "BenoitLink": 0.20116782494375872 / OpenLayers.METERS_PER_INCH, //EPSG:9063
    "SearsLink": 0.2011676512155 / OpenLayers.METERS_PER_INCH, //EPSG:9043
    "Rod": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "IntnlChain": 20.1168 / OpenLayers.METERS_PER_INCH, //EPSG:9097
    "IntnlLink": 0.201168 / OpenLayers.METERS_PER_INCH, //EPSG:9098
    "Perch": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Pole": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Furlong": 201.1684023368046 / OpenLayers.METERS_PER_INCH,
    "Rood": 3.778266898 / OpenLayers.METERS_PER_INCH,
    "CapeFoot": 0.3047972615 / OpenLayers.METERS_PER_INCH,
    "Brealey": 375.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "ModAmFt": 0.304812252984505969011938 / OpenLayers.METERS_PER_INCH,
    "Fathom": 1.8288 / OpenLayers.METERS_PER_INCH,
    "NautM-UK": 1853.184 / OpenLayers.METERS_PER_INCH,
    "50kilometers": 50000.0 / OpenLayers.METERS_PER_INCH,
    "150kilometers": 150000.0 / OpenLayers.METERS_PER_INCH
});

//unit abbreviations supported by PROJ.4
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "mm": OpenLayers.INCHES_PER_UNIT["Meter"] / 1000.0,
    "cm": OpenLayers.INCHES_PER_UNIT["Meter"] / 100.0,
    "dm": OpenLayers.INCHES_PER_UNIT["Meter"] * 100.0,
    "km": OpenLayers.INCHES_PER_UNIT["Meter"] * 1000.0,
    "kmi": OpenLayers.INCHES_PER_UNIT["nmi"], //International Nautical Mile
    "fath": OpenLayers.INCHES_PER_UNIT["Fathom"], //International Fathom
    "ch": OpenLayers.INCHES_PER_UNIT["IntnlChain"], //International Chain
    "link": OpenLayers.INCHES_PER_UNIT["IntnlLink"], //International Link
    "us-in": OpenLayers.INCHES_PER_UNIT["inches"], //U.S. Surveyor's Inch
    "us-ft": OpenLayers.INCHES_PER_UNIT["Foot"], //U.S. Surveyor's Foot
    "us-yd": OpenLayers.INCHES_PER_UNIT["Yard"], //U.S. Surveyor's Yard
    "us-ch": OpenLayers.INCHES_PER_UNIT["GunterChain"], //U.S. Surveyor's Chain
    "us-mi": OpenLayers.INCHES_PER_UNIT["Mile"], //U.S. Surveyor's Statute Mile
    "ind-yd": OpenLayers.INCHES_PER_UNIT["IndianYd37"], //Indian Yard
    "ind-ft": OpenLayers.INCHES_PER_UNIT["IndianFt37"], //Indian Foot
    "ind-ch": 20.11669506 / OpenLayers.METERS_PER_INCH //Indian Chain
});

/** 
 * Constant: DOTS_PER_INCH
 * {Integer} 72 (A sensible default)
 */
OpenLayers.DOTS_PER_INCH = 72;

/**
 * Function: normalizeScale
 *
 * Parameters:
 * scale - {float}
 *
 * Returns:
 * {Float} A normalized scale value, in 1 / X format.
 *         This means that if a value less than one ( already 1/x) is passed
 *         in, it just returns scale directly. Otherwise, it returns
 *         1 / scale
 */
OpenLayers.Util.normalizeScale = function(scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) : scale;
    return normScale;
};

/**
 * Function: getResolutionFromScale
 *
 * Parameters:
 * scale - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 *
 * Returns:
 * {Float} The corresponding resolution given passed-in scale and unit
 *     parameters.  If the given scale is falsey, the returned resolution will
 *     be undefined.
 */
OpenLayers.Util.getResolutionFromScale = function(scale, units) {
    var resolution;
    if (scale) {
        if (units == null) {
            units = "degrees";
        }
        var normScale = OpenLayers.Util.normalizeScale(scale);
        resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units] * OpenLayers.DOTS_PER_INCH);
    }
    return resolution;
};

/**
 * Function: getScaleFromResolution
 *
 * Parameters:
 * resolution - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 *
 * Returns:
 * {Float} The corresponding scale given passed-in resolution and unit
 *         parameters.
 */
OpenLayers.Util.getScaleFromResolution = function(resolution, units) {

    if (units == null) {
        units = "degrees";
    }

    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] *
        OpenLayers.DOTS_PER_INCH;
    return scale;
};

/**
 * Function: pagePosition
 * Calculates the position of an element on the page (see
 * http://code.google.com/p/doctype/wiki/ArticlePageOffset)
 *
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 *
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 *
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Parameters:
 * forElement - {DOMElement}
 *
 * Returns:
 * {Array} two item array, Left value then Top value.
 */
OpenLayers.Util.pagePosition = function(forElement) {
    // NOTE: If element is hidden (display none or disconnected or any the
    // ancestors are hidden) we get (0,0) by default but we still do the
    // accumulation of scroll position.

    var pos = [0, 0];
    var viewportElement = OpenLayers.Util.getViewportElement();
    if (!forElement || forElement == window || forElement == viewportElement) {
        // viewport is always at 0,0 as that defined the coordinate system for
        // this function - this avoids special case checks in the code below
        return pos;
    }

    // Gecko browsers normally use getBoxObjectFor to calculate the position.
    // When invoked for an element with an implicit absolute position though it
    // can be off by one. Therefore the recursive implementation is used in
    // those (relatively rare) cases.
    var BUGGY_GECKO_BOX_OBJECT =
        OpenLayers.IS_GECKO && document.getBoxObjectFor &&
        OpenLayers.Element.getStyle(forElement, 'position') == 'absolute' &&
        (forElement.style.top == '' || forElement.style.left == '');

    var parent = null;
    var box;

    if (forElement.getBoundingClientRect) { // IE
        box = forElement.getBoundingClientRect();
        var scrollTop = window.pageYOffset || viewportElement.scrollTop;
        var scrollLeft = window.pageXOffset || viewportElement.scrollLeft;

        pos[0] = box.left + scrollLeft;
        pos[1] = box.top + scrollTop;

    } else if (document.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) { // gecko
        // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = document.getBoxObjectFor(forElement);
        var vpBox = document.getBoxObjectFor(viewportElement);
        pos[0] = box.screenX - vpBox.screenX;
        pos[1] = box.screenY - vpBox.screenY;

    } else { // safari/opera
        pos[0] = forElement.offsetLeft;
        pos[1] = forElement.offsetTop;
        parent = forElement.offsetParent;
        if (parent != forElement) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }

        var browser = OpenLayers.BROWSER_NAME;

        // opera & (safari absolute) incorrectly account for body offsetTop
        if (browser == "opera" || (browser == "safari" &&
            OpenLayers.Element.getStyle(forElement, 'position') == 'absolute')) {
            pos[1] -= document.body.offsetTop;
        }

        // accumulate the scroll positions for everything but the body element
        parent = forElement.offsetParent;
        while (parent && parent != document.body) {
            pos[0] -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
            if (browser != "opera" || parent.tagName != 'TR') {
                pos[1] -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }

    return pos;
};

/**
 * Function: getViewportElement
 * Returns die viewport element of the document. The viewport element is
 * usually document.documentElement, except in IE,where it is either
 * document.body or document.documentElement, depending on the document's
 * compatibility mode (see
 * http://code.google.com/p/doctype/wiki/ArticleClientViewportElement)
 *
 * Returns:
 * {DOMElement}
 */
OpenLayers.Util.getViewportElement = function() {
    var viewportElement = arguments.callee.viewportElement;
    if (viewportElement == undefined) {
        viewportElement = (OpenLayers.BROWSER_NAME == "msie" &&
            document.compatMode != 'CSS1Compat') ? document.body :
            document.documentElement;
        arguments.callee.viewportElement = viewportElement;
    }
    return viewportElement;
};

/** 
 * Function: isEquivalentUrl
 * Test two URLs for equivalence.
 *
 * Setting 'ignoreCase' allows for case-independent comparison.
 *
 * Comparison is based on:
 *  - Protocol
 *  - Host (evaluated without the port)
 *  - Port (set 'ignorePort80' to ignore "80" values)
 *  - Hash ( set 'ignoreHash' to disable)
 *  - Pathname (for relative <-> absolute comparison)
 *  - Arguments (so they can be out of order)
 *
 * Parameters:
 * url1 - {String}
 * url2 - {String}
 * options - {Object} Allows for customization of comparison:
 *                    'ignoreCase' - Default is True
 *                    'ignorePort80' - Default is True
 *                    'ignoreHash' - Default is True
 *
 * Returns:
 * {Boolean} Whether or not the two URLs are equivalent
 */
OpenLayers.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || {};

    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true,
        splitArgs: false
    });

    var urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    var urlObj2 = OpenLayers.Util.createUrlObject(url2, options);

    //compare all keys except for "args" (treated below)
    for (var key in urlObj1) {
        if (key !== "args") {
            if (urlObj1[key] != urlObj2[key]) {
                return false;
            }
        }
    }

    // compare search args - irrespective of order
    for (var key in urlObj1.args) {
        if (urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    // urlObj2 shouldn't have any args left
    for (var key in urlObj2.args) {
        return false;
    }

    return true;
};

/**
 * Function: createUrlObject
 *
 * Parameters:
 * url - {String}
 * options - {Object} A hash of options.
 *
 * Valid options:
 *   ignoreCase - {Boolean} lowercase url,
 *   ignorePort80 - {Boolean} don't include explicit port if port is 80,
 *   ignoreHash - {Boolean} Don't include part of url after the hash (#).
 *   splitArgs - {Boolean} Split comma delimited params into arrays? Default is
 *       true.
 *
 * Returns:
 * {Object} An object with separate url, a, port, host, and args parsed out
 *          and ready for comparison
 */
OpenLayers.Util.createUrlObject = function(url, options) {
    options = options || {};

    // deal with relative urls first
    if (!(/^\w+:\/\//).test(url)) {
        var loc = window.location;
        var port = loc.port ? ":" + loc.port : "";
        var fullUrl = loc.protocol + "//" + loc.host.split(":").shift() + port;
        if (url.indexOf("/") === 0) {
            // full pathname
            url = fullUrl + url;
        } else {
            // relative to current path
            var parts = loc.pathname.split("/");
            parts.pop();
            url = fullUrl + parts.join("/") + "/" + url;
        }
    }

    if (options.ignoreCase) {
        url = url.toLowerCase();
    }

    var a = document.createElement('a');
    a.href = url;

    var urlObject = {};

    //host (without port)
    urlObject.host = a.host.split(":").shift();

    //protocol
    urlObject.protocol = a.protocol;

    //port (get uniform browser behavior with port 80 here)
    if (options.ignorePort80) {
        urlObject.port = (a.port == "80" || a.port == "0") ? "" : a.port;
    } else {
        urlObject.port = (a.port == "" || a.port == "0") ? "80" : a.port;
    }

    //hash
    urlObject.hash = (options.ignoreHash || a.hash === "#") ? "" : a.hash;

    //args
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getParameters(queryString, {
        splitArgs: options.splitArgs
    });

    // pathname
    //
    // This is a workaround for Internet Explorer where
    // window.location.pathname has a leading "/", but
    // a.pathname has no leading "/".
    urlObject.pathname = (a.pathname.charAt(0) == "/") ? a.pathname : "/" + a.pathname;

    return urlObject;
};

/**
 * Function: removeTail
 * Takes a url and removes everything after the ? and #
 *
 * Parameters:
 * url - {String} The url to process
 *
 * Returns:
 * {String} The string with all queryString and Hash removed
 */
OpenLayers.Util.removeTail = function(url) {
    var head = null;

    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");

    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0, hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0, Math.min(qMark, hashMark)) : url.substr(0, qMark);
    }
    return head;
};


/**
 * Constant: BROWSER_NAME
 * {String}
 * A substring of the navigator.userAgent property.  Depending on the userAgent
 *     property, this will be the empty string or one of the following:
 *     * "opera" -- Opera
 *     * "msie"  -- Internet Explorer
 *     * "safari" -- Safari
 *     * "firefox" -- Firefox
 *     * "mozilla" -- Mozilla
 */
OpenLayers.BROWSER_NAME = (function() {
    return null;
})();

/**
 * Function: getBrowserName
 *
 * Returns:
 * {String} A string which specifies which is the current
 *          browser in which we are running.
 *
 *          Currently-supported browser detection and codes:
 *           * 'opera' -- Opera
 *           * 'msie'  -- Internet Explorer
 *           * 'safari' -- Safari
 *           * 'firefox' -- Firefox
 *           * 'mozilla' -- Mozilla
 *
 *          If we are unable to property identify the browser, we
 *           return an empty string.
 */
OpenLayers.Util.getBrowserName = function() {
    return OpenLayers.BROWSER_NAME;
};

/**
 * Method: getRenderedDimensions
 * Renders the contentHTML offscreen to determine actual dimensions for
 *     popup sizing. As we need layout to determine dimensions the content
 *     is rendered -9999px to the left and absolute to ensure the
 *     scrollbars do not flicker
 *
 * Parameters:
 * contentHTML
 * size - {<OpenLayers.Size>} If either the 'w' or 'h' properties is
 *     specified, we fix that dimension of the div to be measured. This is
 *     useful in the case where we have a limit in one dimension and must
 *     therefore meaure the flow in the other dimension.
 * options - {Object}
 *
 * Allowed Options:
 *     displayClass - {String} Optional parameter.  A CSS class name(s) string
 *         to provide the CSS context of the rendered content.
 *     containerElement - {DOMElement} Optional parameter. Insert the HTML to
 *         this node instead of the body root when calculating dimensions.
 *
 * Returns:
 * {<OpenLayers.Size>}
 */
OpenLayers.Util.getRenderedDimensions = function(contentHTML, size, options) {

    var w, h;

    // create temp container div with restricted size
    var container = document.createElement("div");
    container.style.visibility = "hidden";

    var containerElement = (options && options.containerElement) ? options.containerElement : document.body;

    // Opera and IE7 can't handle a node with position:aboslute if it inherits
    // position:absolute from a parent.
    var parentHasPositionAbsolute = false;
    var superContainer = null;
    var parent = containerElement;
    while (parent && parent.tagName.toLowerCase() != "body") {
        var parentPosition = OpenLayers.Element.getStyle(parent, "position");
        if (parentPosition == "absolute") {
            parentHasPositionAbsolute = true;
            break;
        } else if (parentPosition && parentPosition != "static") {
            break;
        }
        parent = parent.parentNode;
    }
    if (parentHasPositionAbsolute && (containerElement.clientHeight === 0 ||
        containerElement.clientWidth === 0)) {
        superContainer = document.createElement("div");
        superContainer.style.visibility = "hidden";
        superContainer.style.position = "absolute";
        superContainer.style.overflow = "visible";
        superContainer.style.width = document.body.clientWidth + "px";
        superContainer.style.height = document.body.clientHeight + "px";
        superContainer.appendChild(container);
    }
    container.style.position = "absolute";

    //fix a dimension, if specified.
    if (size) {
        if (size.w) {
            w = size.w;
            container.style.width = w + "px";
        } else if (size.h) {
            h = size.h;
            container.style.height = h + "px";
        }
    }

    //add css classes, if specified
    if (options && options.displayClass) {
        container.className = options.displayClass;
    }

    // create temp content div and assign content
    var content = document.createElement("div");
    content.innerHTML = contentHTML;

    // we need overflow visible when calculating the size
    content.style.overflow = "visible";
    if (content.childNodes) {
        for (var i = 0, l = content.childNodes.length; i < l; i++) {
            if (!content.childNodes[i].style) continue;
            content.childNodes[i].style.overflow = "visible";
        }
    }

    // add content to restricted container 
    container.appendChild(content);

    // append container to body for rendering
    if (superContainer) {
        containerElement.appendChild(superContainer);
    } else {
        containerElement.appendChild(container);
    }

    // calculate scroll width of content and add corners and shadow width
    if (!w) {
        w = parseInt(content.scrollWidth);

        // update container width to allow height to adjust
        container.style.width = w + "px";
    }
    // capture height and add shadow and corner image widths
    if (!h) {
        h = parseInt(content.scrollHeight);
    }

    // remove elements
    container.removeChild(content);
    if (superContainer) {
        superContainer.removeChild(container);
        containerElement.removeChild(superContainer);
    } else {
        containerElement.removeChild(container);
    }

    return new OpenLayers.Size(w, h);
};

/**
 * APIFunction: getScrollbarWidth
 * This function has been modified by the OpenLayers from the original version,
 *     written by Matthew Eernisse and released under the Apache 2
 *     license here:
 *
 *     http://www.fleegix.org/articles/2006/05/30/getting-the-scrollbar-width-in-pixels
 *
 *     It has been modified simply to cache its value, since it is physically
 *     impossible that this code could ever run in more than one browser at
 *     once.
 *
 * Returns:
 * {Integer}
 */
OpenLayers.Util.getScrollbarWidth = function() {

    var scrollbarWidth = OpenLayers.Util._scrollbarWidth;

    if (scrollbarWidth == null) {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;

        // Outer scrolling div
        scr = document.createElement('div');
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        // Start with no scrollbar
        scr.style.overflow = 'hidden';

        // Inner content div
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';

        // Put the inner div in the scrolling div
        scr.appendChild(inn);
        // Append the scrolling div to the doc
        document.body.appendChild(scr);

        // Width of the inner div sans scrollbar
        wNoScroll = inn.offsetWidth;

        // Add the scrollbar
        scr.style.overflow = 'scroll';
        // Width of the inner div width scrollbar
        wScroll = inn.offsetWidth;

        // Remove the scrolling div from the doc
        document.body.removeChild(document.body.lastChild);

        // Pixel width of the scroller
        OpenLayers.Util._scrollbarWidth = (wNoScroll - wScroll);
        scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    }

    return scrollbarWidth;
};

/**
 * APIFunction: getFormattedLonLat
 * This function will return latitude or longitude value formatted as
 *
 * Parameters:
 * coordinate - {Float} the coordinate value to be formatted
 * axis - {String} value of either 'lat' or 'lon' to indicate which axis is to
 *          to be formatted (default = lat)
 * dmsOption - {String} specify the precision of the output can be one of:
 *           'dms' show degrees minutes and seconds
 *           'dm' show only degrees and minutes
 *           'd' show only degrees
 *
 * Returns:
 * {String} the coordinate value formatted as a string
 */
OpenLayers.Util.getFormattedLonLat = function(coordinate, axis, dmsOption) {
    if (!dmsOption) {
        dmsOption = 'dms'; //default to show degree, minutes, seconds
    }

    coordinate = (coordinate + 540) % 360 - 180; // normalize for sphere being round

    var abscoordinate = Math.abs(coordinate);
    var coordinatedegrees = Math.floor(abscoordinate);

    var coordinateminutes = (abscoordinate - coordinatedegrees) / (1 / 60);
    var tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    var coordinateseconds = (tempcoordinateminutes - coordinateminutes) / (1 / 60);
    coordinateseconds = Math.round(coordinateseconds * 10);
    coordinateseconds /= 10;

    if (coordinateseconds >= 60) {
        coordinateseconds -= 60;
        coordinateminutes += 1;
        if (coordinateminutes >= 60) {
            coordinateminutes -= 60;
            coordinatedegrees += 1;
        }
    }

    if (coordinatedegrees < 10) {
        coordinatedegrees = "0" + coordinatedegrees;
    }
    var str = coordinatedegrees + "\u00B0";

    if (dmsOption.indexOf('dm') >= 0) {
        if (coordinateminutes < 10) {
            coordinateminutes = "0" + coordinateminutes;
        }
        str += coordinateminutes + "'";

        if (dmsOption.indexOf('dms') >= 0) {
            if (coordinateseconds < 10) {
                coordinateseconds = "0" + coordinateseconds;
            }
            str += coordinateseconds + '"';
        }
    }

    if (axis == "lon") {
        str += coordinate < 0 ? OpenLayers.i18n("W") : OpenLayers.i18n("E");
    } else {
        str += coordinate < 0 ? OpenLayers.i18n("S") : OpenLayers.i18n("N");
    }
    return str;
};

/**
 * Constant: VERSION_NUMBER
 *
 * This constant identifies the version of OpenLayers.
 *
 * When asking questions or reporting issues, make sure to include the output of
 *     OpenLayers.VERSION_NUMBER in the question or issue-description.
 */
OpenLayers.VERSION_NUMBER = "Release 2.13.1";




/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Geometry
 * A Geometry is a description of a geographic object.  Create an instance of
 * this class with the <OpenLayers.Geometry> constructor.  This is a base class,
 * typical geometry types are described by subclasses of this class.
 *
 * Note that if you use the <OpenLayers.Geometry.fromWKT> method, you must
 * explicitly include the OpenLayers.Format.WKT in your build.
 */
OpenLayers.Geometry = OpenLayers.Class({

    /**
     * Property: id
     * {String} A unique identifier for this geometry.
     */
    id: null,

    /**
     * Property: parent
     * {<OpenLayers.Geometry>}This is set when a Geometry is added as component
     * of another geometry
     */
    parent: null,

    /**
     * Property: bounds
     * {<OpenLayers.Bounds>} The bounds of this geometry
     */
    bounds: null,

    /**
     * Constructor: OpenLayers.Geometry
     * Creates a geometry object.
     */
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /**
     * Method: destroy
     * Destroy this geometry.
     */
    destroy: function() {
        this.id = null;
        this.bounds = null;
    },

    /**
     * APIMethod: clone
     * Create a clone of this geometry.  Does not set any non-standard
     *     properties of the cloned geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry>} An exact clone of this geometry.
     */
    clone: function() {
        return new OpenLayers.Geometry();
    },

    /**
     * Method: setBounds
     * Set the bounds for this Geometry.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    setBounds: function(bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    },

    /**
     * Method: clearBounds
     * Nullify this components bounds and that of its parent as well.
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    },

    /**
     * Method: extendBounds
     * Extend the existing bounds to include the new bounds.
     * If geometry's bounds is not yet set, then set a new Bounds.
     *
     * Parameters:
     * newBounds - {<OpenLayers.Bounds>}
     */
    extendBounds: function(newBounds) {
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    },

    /**
     * APIMethod: getBounds
     * Get the bounds for this Geometry. If bounds is not set, it
     * is calculated again, this makes queries faster.
     *
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getBounds: function() {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    },

    /** 
     * APIMethod: calculateBounds
     * Recalculate the bounds for the geometry.
     */
    calculateBounds: function() {
        //
        // This should be overridden by subclasses.
        //
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options depend on the specific geometry type.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {},

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {},

    /**
     * Method: atPoint
     * Note - This is only an approximation based on the bounds of the
     * geometry.
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * toleranceLon - {float} Optional tolerance in Geometric Coords
     * toleranceLat - {float} Optional tolerance in Geographic Coords
     *
     * Returns:
     * {Boolean} Whether or not the geometry is at the specified location
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        var bounds = this.getBounds();
        if ((bounds != null) && (lonlat != null)) {

            var dX = (toleranceLon != null) ? toleranceLon : 0;
            var dY = (toleranceLat != null) ? toleranceLat : 0;

            var toleranceBounds =
                new OpenLayers.Bounds(this.bounds.left - dX,
                    this.bounds.bottom - dY,
                    this.bounds.right + dX,
                    this.bounds.top + dY);

            atPoint = toleranceBounds.containsLonLat(lonlat);
        }
        return atPoint;
    },

    /**
     * Method: getLength
     * Calculate the length of this geometry. This method is defined in
     * subclasses.
     *
     * Returns:
     * {Float} The length of the collection by summing its parts
     */
    getLength: function() {
        //to be overridden by geometries that actually have a length
        //
        return 0.0;
    },

    /**
     * Method: getArea
     * Calculate the area of this geometry. This method is defined in subclasses.
     *
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        //to be overridden by geometries that actually have an area
        //
        return 0.0;
    },

    /**
     * APIMethod: getCentroid
     * Calculate the centroid of this geometry. This method is defined in subclasses.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return null;
    },

    /**
     * Method: toString
     * Returns a text representation of the geometry.  If the WKT format is
     *     included in a build, this will be the Well-Known Text
     *     representation.
     *
     * Returns:
     * {String} String representation of this geometry.
     */
    toString: function() {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.WKT) {
            string = OpenLayers.Format.WKT.prototype.write(
                new OpenLayers.Feature.Vector(this)
            );
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },

    CLASS_NAME: "OpenLayers.Geometry"
});



/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Point
 * Point geometry class.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {

    /** 
     * APIProperty: x
     * {float}
     */
    x: null,

    /** 
     * APIProperty: y
     * {float}
     */
    y: null,

    /**
     * Constructor: OpenLayers.Geometry.Point
     * Construct a point geometry.
     *
     * Parameters:
     * x - {float}
     * y - {float}
     *
     */
    initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);

        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

    /**
     * APIMethod: clone
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} An exact clone of this OpenLayers.Geometry.Point
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

    /** 
     * Method: calculateBounds
     * Create a new Bounds based on the lon/lat
     */
    calculateBounds: function() {
        this.bounds = new OpenLayers.Bounds(this.x, this.y,
            this.x, this.y);
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if (geometry instanceof OpenLayers.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {
                    x0: x0,
                    y0: y0,
                    x1: x1,
                    y1: y1,
                    distance: distance
            };
        } else {
            result = geometry.distanceTo(this, options);
            if (details) {
                // switch coord order since this geom is target
                result = {
                    x0: result.x1,
                    y0: result.y1,
                    x1: result.x0,
                    y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },

    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     *
     * Parameters:
     * geom - {<OpenLayers.Geometry.Point>} The geometry to test.
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) ||
                (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },

    /**
     * Method: toShortString
     *
     * Returns:
     * {String} Shortened String representation of Point object.
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString: function() {
        return (this.x + ", " + this.y);
    },

    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction.
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },

    /**
     * APIMethod: rotate
     * Rotate a point around another.
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },

    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return new OpenLayers.Geometry.Point(this.x, this.y);
    },

    /**
     * APIMethod: resize
     * Resize a point relative to some origin.  For points, this has the effect
     *     of scaling a vector (from the origin to the point).  This method is
     *     more useful on geometry collection subclasses.
     *
     * Parameters:
     * scale - {Float} Ratio of the new distance from the origin to the old
     *                 distance from the origin.  A scale of 2 doubles the
     *                 distance between the point and origin.
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     *
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry.
     */
    resize: function(scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },

    /**
     * APIMethod: transform
     * Translate the x,y properties of the point from source to dest.
     *
     * Parameters:
     * source - {<OpenLayers.Projection>}
     * dest - {<OpenLayers.Projection>}
     *
     * Returns:
     * {<OpenLayers.Geometry>}
     */
    transform: function(source, dest) {
        if ((source && dest)) {
            OpenLayers.Projection.transform(
                this, source, dest);
            this.bounds = null;
        }
        return this;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        return [this];
    },

    CLASS_NAME: "OpenLayers.Geometry.Point"
});



/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Collection
 * A Collection is exactly what it sounds like: A collection of different
 * Geometries. These are stored in the local parameter <components> (which
 * can be passed as a parameter to the constructor).
 *
 * As new geometries are added to the collection, they are NOT cloned.
 * When removing geometries, they need to be specified by reference (ie you
 * have to pass in the *exact* geometry to be removed).
 *
 * The <getArea> and <getLength> functions here merely iterate through
 * the components, summing their respective areas and lengths.
 *
 * Create a new instance with the <OpenLayers.Geometry.Collection> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {

    /**
     * APIProperty: components
     * {Array(<OpenLayers.Geometry>)} The component parts of this geometry
     */
    components: null,

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: null,

    /**
     * Constructor: OpenLayers.Geometry.Collection
     * Creates a Geometry Collection -- a list of geoms.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} Optional array of geometries
     *
     */
    initialize: function(components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * APIMethod: destroy
     * Destroy this geometry.
     */
    destroy: function() {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: clone
     * Clone this geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.Collection>} An exact clone of this collection
     */
    clone: function() {
        var geometry = eval("new " + this.CLASS_NAME + "()");
        for (var i = 0, len = this.components.length; i < len; i++) {
            geometry.addComponent(this.components[i].clone());
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(geometry, this);

        return geometry;
    },

    /**
     * Method: getComponentsString
     * Get a string representing the components for this collection
     *
     * Returns:
     * {String} A string representation of the components of this geometry
     */
    getComponentsString: function() {
        var strings = [];
        for (var i = 0, len = this.components.length; i < len; i++) {
            strings.push(this.components[i].toShortString());
        }
        return strings.join(",");
    },

    /**
     * APIMethod: calculateBounds
     * Recalculate the bounds by iterating through the components and
     * calling calling extendBounds() on each item.
     */
    calculateBounds: function() {
        this.bounds = null;
        var bounds = new OpenLayers.Bounds();
        var components = this.components;
        if (components) {
            for (var i = 0, len = components.length; i < len; i++) {
                bounds.extend(components[i].getBounds());
            }
        }
        // to preserve old behavior, we only set bounds if non-null
        // in the future, we could add bounds.isEmpty()
        if (bounds.left != null && bounds.bottom != null &&
            bounds.right != null && bounds.top != null) {
            this.setBounds(bounds);
        }
    },

    /**
     * APIMethod: addComponents
     * Add components to this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} An array of geometries to add
     */
    addComponents: function(components) {
        if (!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for (var i = 0, len = components.length; i < len; i++) {
            this.addComponent(components[i]);
        }
    },

    /**
     * Method: addComponent
     * Add a new component (geometry) to the collection.  If this.componentTypes
     * is set, then the component class name must be in the componentTypes array.
     *
     * The bounds cache is reset.
     *
     * Parameters:
     * component - {<OpenLayers.Geometry>} A geometry to add
     * index - {int} Optional index into the array to insert the component
     *
     * Returns:
     * {Boolean} The component geometry was successfully added
     */
    addComponent: function(component, index) {
        var added = false;
        if (component) {
            if (this.componentTypes == null ||
                (OpenLayers.Util.indexOf(this.componentTypes,
                    component.CLASS_NAME) > -1)) {

                if (index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index,
                        this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },

    /**
     * APIMethod: removeComponents
     * Remove components from this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} The components to be removed
     *
     * Returns:
     * {Boolean} A component was removed.
     */
    removeComponents: function(components) {
        var removed = false;

        if (!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for (var i = components.length - 1; i >= 0; --i) {
            removed = this.removeComponent(components[i]) || removed;
        }
        return removed;
    },

    /**
     * Method: removeComponent
     * Remove a component from this geometry.
     *
     * Parameters:
     * component - {<OpenLayers.Geometry>}
     *
     * Returns:
     * {Boolean} The component was removed.
     */
    removeComponent: function(component) {

        OpenLayers.Util.removeItem(this.components, component);

        // clearBounds() so that it gets recalculated on the next call
        // to this.getBounds();
        this.clearBounds();
        return true;
    },

    /**
     * APIMethod: getLength
     * Calculate the length of this geometry
     *
     * Returns:
     * {Float} The length of the geometry
     */
    getLength: function() {
        var length = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },

    /**
     * APIMethod: getArea
     * Calculate the area of this geometry. Note how this function is overridden
     * in <OpenLayers.Geometry.Polygon>.
     *
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        var area = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     *
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate geodesic area of the geometry in square meters.
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            area += this.components[i].getGeodesicArea(projection);
        }
        return area;
    },

    /**
     * APIMethod: getCentroid
     *
     * Compute the centroid for this geometry collection.
     *
     * Parameters:
     * weighted - {Boolean} Perform the getCentroid computation recursively,
     * returning an area weighted average of all geometries in this collection.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function(weighted) {
        if (!weighted) {
            return this.components.length && this.components[0].getCentroid();
        }
        var len = this.components.length;
        if (!len) {
            return false;
        }

        var areas = [];
        var centroids = [];
        var areaSum = 0;
        var minArea = Number.MAX_VALUE;
        var component;
        for (var i = 0; i < len; ++i) {
            component = this.components[i];
            var area = component.getArea();
            var centroid = component.getCentroid(true);
            if (isNaN(area) || isNaN(centroid.x) || isNaN(centroid.y)) {
                continue;
            }
            areas.push(area);
            areaSum += area;
            minArea = (area < minArea && area > 0) ? area : minArea;
            centroids.push(centroid);
        }
        len = areas.length;
        if (areaSum === 0) {
            // all the components in this collection have 0 area
            // probably a collection of points -- weight all the points the same
            for (var i = 0; i < len; ++i) {
                areas[i] = 1;
            }
            areaSum = areas.length;
        } else {
            // normalize all the areas where the smallest area will get
            // a value of 1
            for (var i = 0; i < len; ++i) {
                areas[i] /= minArea;
            }
            areaSum /= minArea;
        }

        var xSum = 0,
            ySum = 0,
            centroid, area;
        for (var i = 0; i < len; ++i) {
            centroid = centroids[i];
            area = areas[i];
            xSum += centroid.x * area;
            ySum += centroid.y * area;
        }

        return new OpenLayers.Geometry.Point(xSum / areaSum, ySum / areaSum);
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     *
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var length = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            length += this.components[i].getGeodesicLength(projection);
        }
        return length;
    },

    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction.
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        for (var i = 0, len = this.components.length; i < len; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * APIMethod: rotate
     * Rotate a geometry around some origin
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        for (var i = 0, len = this.components.length; i < len; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

    /**
     * APIMethod: resize
     * Resize a geometry relative to some origin.  Use this method to apply
     *     a uniform scaling to a geometry.
     *
     * Parameters:
     * scale - {Float} Factor by which to scale the geometry.  A scale of 2
     *                 doubles the size of the geometry in each dimension
     *                 (lines, for example, will be twice as long, and polygons
     *                 will have four times the area).
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     *
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry.
     */
    resize: function(scale, origin, ratio) {
        for (var i = 0; i < this.components.length; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best, distance;
        var min = Number.POSITIVE_INFINITY;
        for (var i = 0, len = this.components.length; i < len; ++i) {
            result = this.components[i].distanceTo(geometry, options);
            distance = details ? result.distance : result;
            if (distance < min) {
                min = distance;
                best = result;
                if (min == 0) {
                    break;
                }
            }
        }
        return best;
    },

    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The geometry to test.
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geometry) {
        var equivalent = true;
        if (!geometry || !geometry.CLASS_NAME ||
            (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if (!(OpenLayers.Util.isArray(geometry.components)) ||
            (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for (var i = 0, len = this.components.length; i < len; ++i) {
                if (!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },

    /**
     * APIMethod: transform
     * Reproject the components geometry from source to dest.
     *
     * Parameters:
     * source - {<OpenLayers.Projection>}
     * dest - {<OpenLayers.Projection>}
     *
     * Returns:
     * {<OpenLayers.Geometry>}
     */
    transform: function(source, dest) {
        if (source && dest) {
            for (var i = 0, len = this.components.length; i < len; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        for (var i = 0, len = this.components.length; i < len; ++i) {
            intersect = geometry.intersects(this.components[i]);
            if (intersect) {
                break;
            }
        }
        return intersect;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices = [];
        for (var i = 0, len = this.components.length; i < len; ++i) {
            Array.prototype.push.apply(
                vertices, this.components[i].getVertices(nodes)
            );
        }
        return vertices;
    },


    CLASS_NAME: "OpenLayers.Geometry.Collection"
});




/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/Point.js
 */

/**
 * Class: OpenLayers.Geometry.MultiPoint
 * MultiPoint is a collection of Points.  Create a new instance with the
 * <OpenLayers.Geometry.MultiPoint> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.MultiPoint = OpenLayers.Class(
    OpenLayers.Geometry.Collection, {

        /**
         * Property: componentTypes
         * {Array(String)} An array of class names representing the types of
         * components that the collection can include.  A null value means the
         * component types are not restricted.
         */
        componentTypes: ["OpenLayers.Geometry.Point"],

        /**
         * Constructor: OpenLayers.Geometry.MultiPoint
         * Create a new MultiPoint Geometry
         *
         * Parameters:
         * components - {Array(<OpenLayers.Geometry.Point>)}
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiPoint>}
         */

        /**
         * APIMethod: addPoint
         * Wrapper for <OpenLayers.Geometry.Collection.addComponent>
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>} Point to be added
         * index - {Integer} Optional index
         */
        addPoint: function(point, index) {
            this.addComponent(point, index);
        },

        /**
         * APIMethod: removePoint
         * Wrapper for <OpenLayers.Geometry.Collection.removeComponent>
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>} Point to be removed
         */
        removePoint: function(point) {
            this.removeComponent(point);
        },

        CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
    });




/**
 * @requires OpenLayers/Geometry/MultiPoint.js
 */

/**
 * Class: OpenLayers.Geometry.Curve
 * A Curve is a MultiPoint, whose points are assumed to be connected. To
 * this end, we provide a "getLength()" function, which iterates through
 * the points, summing the distances between them.
 *
 * Inherits:
 *  - <OpenLayers.Geometry.MultiPoint>
 */
OpenLayers.Geometry.Curve = OpenLayers.Class(OpenLayers.Geometry.MultiPoint, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     *                 components that the collection can include.  A null
     *                 value means the component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.Curve
     *
     * Parameters:
     * point - {Array(<OpenLayers.Geometry.Point>)}
     */

    /**
     * APIMethod: getLength
     *
     * Returns:
     * {Float} The length of the curve
     */
    getLength: function() {
        var length = 0.0;
        if (this.components && (this.components.length > 1)) {
            for (var i = 1, len = this.components.length; i < len; i++) {
                length += this.components[i - 1].distanceTo(this.components[i]);
            }
        }
        return length;
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     *
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var geom = this; // so we can work with a clone if needed
        if (projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if (!gg.equals(projection)) {
                geom = this.clone().transform(projection, gg);
            }
        }
        var length = 0.0;
        if (geom.components && (geom.components.length > 1)) {
            var p1, p2;
            for (var i = 1, len = geom.components.length; i < len; i++) {
                p1 = geom.components[i - 1];
                p2 = geom.components[i];
                // this returns km and requires lon/lat properties
                length += OpenLayers.Util.distVincenty({
                    lon: p1.x,
                    lat: p1.y
                }, {
                    lon: p2.x,
                    lat: p2.y
                });
            }
        }
        // convert to m
        return length * 1000;
    },

    CLASS_NAME: "OpenLayers.Geometry.Curve"
});




/**
 * @requires OpenLayers/Geometry/Curve.js
 */

/**
 * Class: OpenLayers.Geometry.LineString
 * A LineString is a Curve which, once two points have been added to it, can
 * never be less than two points long.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry.Curve>
 */
OpenLayers.Geometry.LineString = OpenLayers.Class(OpenLayers.Geometry.Curve, {

    /**
     * Constructor: OpenLayers.Geometry.LineString
     * Create a new LineString geometry
     *
     * Parameters:
     * points - {Array(<OpenLayers.Geometry.Point>)} An array of points used to
     *          generate the linestring
     *
     */

    /**
     * APIMethod: removeComponent
     * Only allows removal of a point if there are three or more points in
     * the linestring. (otherwise the result would be just a single point)
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>} The point to be removed
     *
     * Returns:
     * {Boolean} The component was removed.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,
                arguments);
        }
        return removed;
    },

    /**
     * APIMethod: intersects
     * Test for instersection between two geometries.  This is a cheapo
     *     implementation of the Bently-Ottmann algorigithm.  It doesn't
     *     really keep track of a sweep line data structure.  It is closer
     *     to the brute force method, except that segments are sorted and
     *     potential intersections are only calculated when bounding boxes
     *     intersect.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     *
     * Returns:
     * {Boolean} The input geometry intersects this geometry.
     */
    intersects: function(geometry) {
        var intersect = false;
        var type = geometry.CLASS_NAME;
        if (type == "OpenLayers.Geometry.LineString" ||
            type == "OpenLayers.Geometry.LinearRing" ||
            type == "OpenLayers.Geometry.Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if (type == "OpenLayers.Geometry.Point") {
                segs2 = [{
                    x1: geometry.x,
                    y1: geometry.y,
                    x2: geometry.x,
                    y2: geometry.y
                }];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2,
                seg2, seg2y1, seg2y2;
            // sweep right
            outer: for (var i = 0, len = segs1.length; i < len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for (var j = 0, jlen = segs2.length; j < jlen; ++j) {
                    seg2 = segs2[j];
                    if (seg2.x1 > seg1x2) {
                        // seg1 still left of seg2
                        break;
                    }
                    if (seg2.x2 < seg1x1) {
                        // seg2 still left of seg1
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if (Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        // seg2 above seg1
                        continue;
                    }
                    if (Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        // seg2 below seg1
                        continue;
                    }
                    if (OpenLayers.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },

    /**
     * Method: getSortedSegments
     *
     * Returns:
     * {Array} An array of segment objects.  Segment objects have properties
     *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
     *     The end point is represented by x2 and y2.  Start and end are
     *     ordered so that x1 < x2.
     */
    getSortedSegments: function() {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg),
            point1, point2;
        for (var i = 0; i < numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if (point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);
    },

    /**
     * Method: splitWithSegment
     * Split this geometry with the given segment.
     *
     * Parameters:
     * seg - {Object} An object with x1, y1, x2, and y2 properties referencing
     *     segment endpoint coordinates.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source segment must be within the
     *     tolerance distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of one of the source segment's
     *     endpoints will be assumed to occur at the endpoint.
     *
     * Returns:
     * {Object} An object with *lines* and *points* properties.  If the given
     *     segment intersects this linestring, the lines array will reference
     *     geometries that result from the split.  The points array will contain
     *     all intersection points.  Intersection points are sorted along the
     *     segment (in order from x1,y1 to x2,y2).
     */
    splitWithSegment: function(seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {
            point: true,
            tolerance: tolerance
        };
        var result = null;
        for (var i = 0, stop = verts.length - 2; i <= stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i + 1];
            target = {
                x1: vert1.x,
                y1: vert1.y,
                x2: vert2.x,
                y2: vert2.y
            };
            point = OpenLayers.Geometry.segmentsIntersect(
                seg, target, interOptions
            );
            if (point instanceof OpenLayers.Geometry.Point) {
                if ((point.x === seg.x1 && point.y === seg.y1) ||
                    (point.x === seg.x2 && point.y === seg.y2) ||
                    point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if (vertex || edge) {
                    // push intersections different than the previous
                    if (!point.equals(intersections[intersections.length - 1])) {
                        intersections.push(point.clone());
                    }
                    if (i === 0) {
                        if (point.equals(vert1)) {
                            continue;
                        }
                    }
                    if (point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if (!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new OpenLayers.Geometry.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if (split) {
            points.push(vert2.clone());
            lines.push(new OpenLayers.Geometry.LineString(points));
        }
        if (intersections.length > 0) {
            // sort intersections along segment
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function(p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },

    /**
     * Method: split
     * Use this geometry (the source) to attempt to split a target geometry.
     *
     * Parameters:
     * target - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     *
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    split: function(target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if (target instanceof OpenLayers.Geometry.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for (var i = 0, stop = verts.length - 2; i <= stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i + 1];
                seg = {
                    x1: vert1.x,
                    y1: vert1.y,
                    x2: vert2.x,
                    y2: vert2.y
                };
                targetParts = targetParts || [target];
                if (mutual) {
                    points.push(vert1.clone());
                }
                for (var j = 0; j < targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if (splits) {
                        // splice in new features
                        lines = splits.lines;
                        if (lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if (mutual) {
                            for (var k = 0, len = splits.points.length; k < len; ++k) {
                                point = splits.points[k];
                                if (!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new OpenLayers.Geometry.LineString(points));
                                    if (point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new OpenLayers.Geometry.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if (targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if (sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if (targetSplit || sourceSplit) {
            if (mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * Method: splitWith
     * Split this geometry (the target) with the given geometry (the source).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} A geometry used to split this
     *     geometry (the source).
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     *
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    splitWith: function(geometry, options) {
        return geometry.split(this, options);

    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices;
        if (nodes === true) {
            vertices = [
                this.components[0],
                this.components[this.components.length - 1]
            ];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length - 1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if (geometry instanceof OpenLayers.Geometry.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for (var i = 0, len = segs.length; i < len; ++i) {
                seg = segs[i];
                result = OpenLayers.Geometry.distanceToSegment(geometry, seg);
                if (result.distance < min) {
                    min = result.distance;
                    best = result;
                    if (min === 0) {
                        break;
                    }
                } else {
                    // if distance increases and we cross y0 to the right of x0, no need to keep looking.
                    if (seg.x2 > x && ((y > seg.y1 && y < seg.y2) || (y < seg.y1 && y > seg.y2))) {
                        break;
                    }
                }
            }
            if (details) {
                best = {
                    distance: best.distance,
                    x0: best.x,
                    y0: best.y,
                    x1: x,
                    y1: y
                };
            } else {
                best = best.distance;
            }
        } else if (geometry instanceof OpenLayers.Geometry.LineString) {
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {
                point: true
            };
            outer: for (var i = 0, len = segs0.length; i < len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for (var j = 0; j < len1; ++j) {
                    seg1 = segs1[j];
                    intersection = OpenLayers.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if (intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x,
                            y0: intersection.y,
                            x1: intersection.x,
                            y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = OpenLayers.Geometry.distanceToSegment({
                            x: x0,
                            y: y0
                        }, seg1);
                        if (result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0,
                                y0: y0,
                                x1: result.x,
                                y1: result.y
                            };
                        }
                    }
                }
            }
            if (!details) {
                best = best.distance;
            }
            if (min !== 0) {
                // check the final vertex in this line's sorted segments
                if (seg0) {
                    result = geometry.distanceTo(
                        new OpenLayers.Geometry.Point(seg0.x2, seg0.y2),
                        options
                    );
                    var dist = details ? result.distance : result;
                    if (dist < min) {
                        if (details) {
                            best = {
                                distance: min,
                                x0: result.x1,
                                y0: result.y1,
                                x1: result.x0,
                                y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            // swap since target comes from this line
            if (details) {
                best = {
                    distance: best.distance,
                    x0: best.x1,
                    y0: best.y1,
                    x1: best.x0,
                    y1: best.y0
                };
            }
        }
        return best;
    },

    /**
     * APIMethod: simplify
     * This function will return a simplified LineString.
     * Simplification is based on the Douglas-Peucker algorithm.
     *
     *
     * Parameters:
     * tolerance - {number} threshhold for simplification in map units
     *
     * Returns:
     * {OpenLayers.Geometry.LineString} the simplified LineString
     */
    simplify: function(tolerance) {
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }

            var compareNumbers = function(a, b) {
                return (a - b);
            };

            /**
             * Private function doing the Douglas-Peucker reduction
             */
            var douglasPeuckerReduction = function(points, firstPoint, lastPoint, tolerance) {
                var maxDistance = 0;
                var indexFarthest = 0;

                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }

                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    //Add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };

            /**
             * Private function calculating the perpendicular distance
             * TODO: check whether OpenLayers.Geometry.LineString::distanceTo() is faster or slower
             */
            var perpendicularDistance = function(point1, point2, point) {
                //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
                //Area = .5*Base*H                                          *Solve for height
                //Height = Area/.5/Base

                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;

                return height;
            };

            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];

            //Add the first and last index to the keepers
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);

            //The first and the last point cannot be the same
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                //Addition: the first point not equal to first point in the LineString is kept as well
                pointIndexsToKeep.push(lastPoint);
            }

            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new OpenLayers.Geometry.LineString(returnPoints);

        } else {
            return this;
        }
    },

    CLASS_NAME: "OpenLayers.Geometry.LineString"
});




/**
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Geometry.LinearRing
 *
 * A Linear Ring is a special LineString which is closed. It closes itself
 * automatically on every addPoint/removePoint by adding a copy of the first
 * point as the last point.
 *
 * Also, as it is the first in the line family to close itself, a getArea()
 * function is defined to calculate the enclosed area of the linearRing
 *
 * Inherits:
 *  - <OpenLayers.Geometry.LineString>
 */
OpenLayers.Geometry.LinearRing = OpenLayers.Class(
    OpenLayers.Geometry.LineString, {

        /**
         * Property: componentTypes
         * {Array(String)} An array of class names representing the types of
         *                 components that the collection can include.  A null
         *                 value means the component types are not restricted.
         */
        componentTypes: ["OpenLayers.Geometry.Point"],

        /**
         * Constructor: OpenLayers.Geometry.LinearRing
         * Linear rings are constructed with an array of points.  This array
         *     can represent a closed or open ring.  If the ring is open (the last
         *     point does not equal the first point), the constructor will close
         *     the ring.  If the ring is already closed (the last point does equal
         *     the first point), it will be left closed.
         *
         * Parameters:
         * points - {Array(<OpenLayers.Geometry.Point>)} points
         */

        /**
         * APIMethod: addComponent
         * Adds a point to geometry components.  If the point is to be added to
         *     the end of the components array and it is the same as the last point
         *     already in that array, the duplicate point is not added.  This has
         *     the effect of closing the ring if it is not already closed, and
         *     doing the right thing if it is already closed.  This behavior can
         *     be overridden by calling the method with a non-null index as the
         *     second argument.
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>}
         * index - {Integer} Index into the array to insert the component
         *
         * Returns:
         * {Boolean} Was the Point successfully added?
         */
        addComponent: function(point, index) {
            var added = false;

            //remove last point
            var lastPoint = this.components.pop();

            // given an index, add the point
            // without an index only add non-duplicate points
            if (index != null || !point.equals(lastPoint)) {
                added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,
                    arguments);
            }

            //append copy of first point
            var firstPoint = this.components[0];
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [firstPoint]);

            return added;
        },

        /**
         * APIMethod: removeComponent
         * Removes a point from geometry components.
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>}
         *
         * Returns:
         * {Boolean} The component was removed.
         */
        removeComponent: function(point) {
            var removed = this.components && (this.components.length > 3);
            if (removed) {
                //remove last point
                this.components.pop();

                //remove our point
                OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,
                    arguments);
                //append copy of first point
                var firstPoint = this.components[0];
                OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [firstPoint]);
            }
            return removed;
        },

        /**
         * APIMethod: move
         * Moves a geometry by the given displacement along positive x and y axes.
         *     This modifies the position of the geometry and clears the cached
         *     bounds.
         *
         * Parameters:
         * x - {Float} Distance to move geometry in positive x direction.
         * y - {Float} Distance to move geometry in positive y direction.
         */
        move: function(x, y) {
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                this.components[i].move(x, y);
            }
        },

        /**
         * APIMethod: rotate
         * Rotate a geometry around some origin
         *
         * Parameters:
         * angle - {Float} Rotation angle in degrees (measured counterclockwise
         *                 from the positive x-axis)
         * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
         */
        rotate: function(angle, origin) {
            for (var i = 0, len = this.components.length; i < len - 1; ++i) {
                this.components[i].rotate(angle, origin);
            }
        },

        /**
         * APIMethod: resize
         * Resize a geometry relative to some origin.  Use this method to apply
         *     a uniform scaling to a geometry.
         *
         * Parameters:
         * scale - {Float} Factor by which to scale the geometry.  A scale of 2
         *                 doubles the size of the geometry in each dimension
         *                 (lines, for example, will be twice as long, and polygons
         *                 will have four times the area).
         * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
         * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
         *
         * Returns:
         * {<OpenLayers.Geometry>} - The current geometry.
         */
        resize: function(scale, origin, ratio) {
            for (var i = 0, len = this.components.length; i < len - 1; ++i) {
                this.components[i].resize(scale, origin, ratio);
            }
            return this;
        },

        /**
         * APIMethod: transform
         * Reproject the components geometry from source to dest.
         *
         * Parameters:
         * source - {<OpenLayers.Projection>}
         * dest - {<OpenLayers.Projection>}
         *
         * Returns:
         * {<OpenLayers.Geometry>}
         */
        transform: function(source, dest) {
            if (source && dest) {
                for (var i = 0, len = this.components.length; i < len - 1; i++) {
                    var component = this.components[i];
                    component.transform(source, dest);
                }
                this.bounds = null;
            }
            return this;
        },

        /**
         * APIMethod: getCentroid
         *
         * Returns:
         * {<OpenLayers.Geometry.Point>} The centroid of the collection
         */
        getCentroid: function() {
            if (this.components) {
                var len = this.components.length;
                if (len > 0 && len <= 2) {
                    return this.components[0].clone();
                } else if (len > 2) {
                    var sumX = 0.0;
                    var sumY = 0.0;
                    var x0 = this.components[0].x;
                    var y0 = this.components[0].y;
                    var area = -1 * this.getArea();
                    if (area != 0) {
                        for (var i = 0; i < len - 1; i++) {
                            var b = this.components[i];
                            var c = this.components[i + 1];
                            sumX += (b.x + c.x - 2 * x0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                            sumY += (b.y + c.y - 2 * y0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                        }
                        var x = x0 + sumX / (6 * area);
                        var y = y0 + sumY / (6 * area);
                    } else {
                        for (var i = 0; i < len - 1; i++) {
                            sumX += this.components[i].x;
                            sumY += this.components[i].y;
                        }
                        var x = sumX / (len - 1);
                        var y = sumY / (len - 1);
                    }
                    return new OpenLayers.Geometry.Point(x, y);
                } else {
                    return null;
                }
            }
        },

        /**
         * APIMethod: getArea
         * Note - The area is positive if the ring is oriented CW, otherwise
         *         it will be negative.
         *
         * Returns:
         * {Float} The signed area for a ring.
         */
        getArea: function() {
            var area = 0.0;
            if (this.components && (this.components.length > 2)) {
                var sum = 0.0;
                for (var i = 0, len = this.components.length; i < len - 1; i++) {
                    var b = this.components[i];
                    var c = this.components[i + 1];
                    sum += (b.x + c.x) * (c.y - b.y);
                }
                area = -sum / 2.0;
            }
            return area;
        },

        /**
         * APIMethod: getGeodesicArea
         * Calculate the approximate area of the polygon were it projected onto
         *     the earth.  Note that this area will be positive if ring is oriented
         *     clockwise, otherwise it will be negative.
         *
         * Parameters:
         * projection - {<OpenLayers.Projection>} The spatial reference system
         *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
         *     assumed.
         *
         * Reference:
         * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
         *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
         *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
         *
         * Returns:
         * {float} The approximate signed geodesic area of the polygon in square
         *     meters.
         */
        getGeodesicArea: function(projection) {
            var ring = this; // so we can work with a clone if needed
            if (projection) {
                var gg = new OpenLayers.Projection("EPSG:4326");
                if (!gg.equals(projection)) {
                    ring = this.clone().transform(projection, gg);
                }
            }
            var area = 0.0;
            var len = ring.components && ring.components.length;
            if (len > 2) {
                var p1, p2;
                for (var i = 0; i < len - 1; i++) {
                    p1 = ring.components[i];
                    p2 = ring.components[i + 1];
                    area += OpenLayers.Util.rad(p2.x - p1.x) *
                        (2 + Math.sin(OpenLayers.Util.rad(p1.y)) +
                        Math.sin(OpenLayers.Util.rad(p2.y)));
                }
                area = area * 6378137.0 * 6378137.0 / 2.0;
            }
            return area;
        },

        /**
         * Method: containsPoint
         * Test if a point is inside a linear ring.  For the case where a point
         *     is coincident with a linear ring edge, returns 1.  Otherwise,
         *     returns boolean.
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>}
         *
         * Returns:
         * {Boolean | Number} The point is inside the linear ring.  Returns 1 if
         *     the point is coincident with an edge.  Returns boolean otherwise.
         */
        containsPoint: function(point) {
            var approx = OpenLayers.Number.limitSigDigs;
            var digs = 14;
            var px = approx(point.x, digs);
            var py = approx(point.y, digs);

            function getX(y, x1, y1, x2, y2) {
                return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
            }
            var numSeg = this.components.length - 1;
            var start, end, x1, y1, x2, y2, cx, cy;
            var crosses = 0;
            for (var i = 0; i < numSeg; ++i) {
                start = this.components[i];
                x1 = approx(start.x, digs);
                y1 = approx(start.y, digs);
                end = this.components[i + 1];
                x2 = approx(end.x, digs);
                y2 = approx(end.y, digs);

                /**
                 * The following conditions enforce five edge-crossing rules:
                 *    1. points coincident with edges are considered contained;
                 *    2. an upward edge includes its starting endpoint, and
                 *    excludes its final endpoint;
                 *    3. a downward edge excludes its starting endpoint, and
                 *    includes its final endpoint;
                 *    4. horizontal edges are excluded; and
                 *    5. the edge-ray intersection point must be strictly right
                 *    of the point P.
                 */
                if (y1 == y2) {
                    // horizontal edge
                    if (py == y1) {
                        // point on horizontal line
                        if (x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                            x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                            // point on edge
                            crosses = -1;
                            break;
                        }
                    }
                    // ignore other horizontal edges
                    continue;
                }
                cx = approx(getX(py, x1, y1, x2, y2), digs);
                if (cx == px) {
                    // point on line
                    if (y1 < y2 && (py >= y1 && py <= y2) || // upward
                        y1 > y2 && (py <= y1 && py >= y2)) { // downward
                        // point on edge
                        crosses = -1;
                        break;
                    }
                }
                if (cx <= px) {
                    // no crossing to the right
                    continue;
                }
                if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                    // no crossing
                    continue;
                }
                if (y1 < y2 && (py >= y1 && py < y2) || // upward
                    y1 > y2 && (py < y1 && py >= y2)) { // downward
                    ++crosses;
                }
            }
            var contained = (crosses == -1) ?
                // on edge
                1 :
                // even (out) or odd (in)
                !!(crosses & 1);

            return contained;
        },

        /**
         * APIMethod: intersects
         * Determine if the input geometry intersects this one.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry>} Any type of geometry.
         *
         * Returns:
         * {Boolean} The input geometry intersects this one.
         */
        intersects: function(geometry) {
            var intersect = false;
            if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                intersect = this.containsPoint(geometry);
            } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                intersect = geometry.intersects(this);
            } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                    this, [geometry]
                );
            } else {
                // check for component intersections
                for (var i = 0, len = geometry.components.length; i < len; ++i) {
                    intersect = geometry.components[i].intersects(this);
                    if (intersect) {
                        break;
                    }
                }
            }
            return intersect;
        },

        /**
         * APIMethod: getVertices
         * Return a list of all points in this geometry.
         *
         * Parameters:
         * nodes - {Boolean} For lines, only return vertices that are
         *     endpoints.  If false, for lines, only vertices that are not
         *     endpoints will be returned.  If not provided, all vertices will
         *     be returned.
         *
         * Returns:
         * {Array} A list of all vertices in the geometry.
         */
        getVertices: function(nodes) {
            return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
        },

        CLASS_NAME: "OpenLayers.Geometry.LinearRing"
    });




/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/LinearRing.js
 */

/**
 * Class: OpenLayers.Geometry.Polygon
 * Polygon is a collection of Geometry.LinearRings.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.Polygon = OpenLayers.Class(
    OpenLayers.Geometry.Collection, {

        /**
         * Property: componentTypes
         * {Array(String)} An array of class names representing the types of
         * components that the collection can include.  A null value means the
         * component types are not restricted.
         */
        componentTypes: ["OpenLayers.Geometry.LinearRing"],

        /**
         * Constructor: OpenLayers.Geometry.Polygon
         * Constructor for a Polygon geometry.
         * The first ring (this.component[0])is the outer bounds of the polygon and
         * all subsequent rings (this.component[1-n]) are internal holes.
         *
         *
         * Parameters:
         * components - {Array(<OpenLayers.Geometry.LinearRing>)}
         */

        /** 
         * APIMethod: getArea
         * Calculated by subtracting the areas of the internal holes from the
         *   area of the outer hole.
         *
         * Returns:
         * {float} The area of the geometry
         */
        getArea: function() {
            var area = 0.0;
            if (this.components && (this.components.length > 0)) {
                area += Math.abs(this.components[0].getArea());
                for (var i = 1, len = this.components.length; i < len; i++) {
                    area -= Math.abs(this.components[i].getArea());
                }
            }
            return area;
        },

        /** 
         * APIMethod: getGeodesicArea
         * Calculate the approximate area of the polygon were it projected onto
         *     the earth.
         *
         * Parameters:
         * projection - {<OpenLayers.Projection>} The spatial reference system
         *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
         *     assumed.
         *
         * Reference:
         * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
         *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
         *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
         *
         * Returns:
         * {float} The approximate geodesic area of the polygon in square meters.
         */
        getGeodesicArea: function(projection) {
            var area = 0.0;
            if (this.components && (this.components.length > 0)) {
                area += Math.abs(this.components[0].getGeodesicArea(projection));
                for (var i = 1, len = this.components.length; i < len; i++) {
                    area -= Math.abs(this.components[i].getGeodesicArea(projection));
                }
            }
            return area;
        },

        /**
         * Method: containsPoint
         * Test if a point is inside a polygon.  Points on a polygon edge are
         *     considered inside.
         *
         * Parameters:
         * point - {<OpenLayers.Geometry.Point>}
         *
         * Returns:
         * {Boolean | Number} The point is inside the polygon.  Returns 1 if the
         *     point is on an edge.  Returns boolean otherwise.
         */
        containsPoint: function(point) {
            var numRings = this.components.length;
            var contained = false;
            if (numRings > 0) {
                // check exterior ring - 1 means on edge, boolean otherwise
                contained = this.components[0].containsPoint(point);
                if (contained !== 1) {
                    if (contained && numRings > 1) {
                        // check interior rings
                        var hole;
                        for (var i = 1; i < numRings; ++i) {
                            hole = this.components[i].containsPoint(point);
                            if (hole) {
                                if (hole === 1) {
                                    // on edge
                                    contained = 1;
                                } else {
                                    // in hole
                                    contained = false;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            return contained;
        },

        /**
         * APIMethod: intersects
         * Determine if the input geometry intersects this one.
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry>} Any type of geometry.
         *
         * Returns:
         * {Boolean} The input geometry intersects this one.
         */
        intersects: function(geometry) {
            var intersect = false;
            var i, len;
            if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                intersect = this.containsPoint(geometry);
            } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" ||
                geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                // check if rings/linestrings intersect
                for (i = 0, len = this.components.length; i < len; ++i) {
                    intersect = geometry.intersects(this.components[i]);
                    if (intersect) {
                        break;
                    }
                }
                if (!intersect) {
                    // check if this poly contains points of the ring/linestring
                    for (i = 0, len = geometry.components.length; i < len; ++i) {
                        intersect = this.containsPoint(geometry.components[i]);
                        if (intersect) {
                            break;
                        }
                    }
                }
            } else {
                for (i = 0, len = geometry.components.length; i < len; ++i) {
                    intersect = this.intersects(geometry.components[i]);
                    if (intersect) {
                        break;
                    }
                }
            }
            // check case where this poly is wholly contained by another
            if (!intersect && geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                // exterior ring points will be contained in the other geometry
                var ring = this.components[0];
                for (i = 0, len = ring.components.length; i < len; ++i) {
                    intersect = geometry.containsPoint(ring.components[i]);
                    if (intersect) {
                        break;
                    }
                }
            }
            return intersect;
        },

        /**
         * APIMethod: distanceTo
         * Calculate the closest distance between two geometries (on the x-y plane).
         *
         * Parameters:
         * geometry - {<OpenLayers.Geometry>} The target geometry.
         * options - {Object} Optional properties for configuring the distance
         *     calculation.
         *
         * Valid options:
         * details - {Boolean} Return details from the distance calculation.
         *     Default is false.
         * edge - {Boolean} Calculate the distance from this geometry to the
         *     nearest edge of the target geometry.  Default is true.  If true,
         *     calling distanceTo from a geometry that is wholly contained within
         *     the target will result in a non-zero distance.  If false, whenever
         *     geometries intersect, calling distanceTo will return 0.  If false,
         *     details cannot be returned.
         *
         * Returns:
         * {Number | Object} The distance between this geometry and the target.
         *     If details is true, the return will be an object with distance,
         *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
         *     the coordinates of the closest point on this geometry. The x1 and y1
         *     properties represent the coordinates of the closest point on the
         *     target geometry.
         */
        distanceTo: function(geometry, options) {
            var edge = !(options && options.edge === false);
            var result;
            // this is the case where we might not be looking for distance to edge
            if (!edge && this.intersects(geometry)) {
                result = 0;
            } else {
                result = OpenLayers.Geometry.Collection.prototype.distanceTo.apply(
                    this, [geometry, options]
                );
            }
            return result;
        },

        CLASS_NAME: "OpenLayers.Geometry.Polygon"
    });

/**
 * APIMethod: createRegularPolygon
 * Create a regular polygon around a radius. Useful for creating circles
 * and the like.
 *
 * Parameters:
 * origin - {<OpenLayers.Geometry.Point>} center of polygon.
 * radius - {Float} distance to vertex, in map units.
 * sides - {Integer} Number of sides. 20 approximates a circle.
 * rotation - {Float} original angle of rotation, in degrees.
 */
OpenLayers.Geometry.Polygon.createRegularPolygon = function(origin, radius, sides, rotation) {
    var angle = Math.PI * ((1 / sides) - (1 / 2));
    if (rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for (var i = 0; i < sides; ++i) {
        rotatedAngle = angle + (i * 2 * Math.PI / sides);
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new OpenLayers.Geometry.Point(x, y));
    }
    var ring = new OpenLayers.Geometry.LinearRing(points);
    return new OpenLayers.Geometry.Polygon([ring]);
};


/**
 * Function: OpenLayers.Geometry.fromWKT
 * Generate a geometry given a Well-Known Text string.  For this method to
 *     work, you must include the OpenLayers.Format.WKT in your build
 *     explicitly.
 *
 * Parameters:
 * wkt - {String} A string representing the geometry in Well-Known Text.
 *
 * Returns:
 * {<OpenLayers.Geometry>} A geometry of the appropriate class.
 */
OpenLayers.Geometry.fromWKT = function(wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i = 0; i < len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};

/**
 * Method: OpenLayers.Geometry.segmentsIntersect
 * Determine whether two line segments intersect.  Optionally calculates
 *     and returns the intersection point.  This function is optimized for
 *     cases where seg1.x2 >= seg2.x1 || seg2.x2 >= seg1.x1.  In those
 *     obvious cases where there is no intersection, the function should
 *     not be called.
 *
 * Parameters:
 * seg1 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * seg2 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * options - {Object} Optional properties for calculating the intersection.
 *
 * Valid options:
 * point - {Boolean} Return the intersection point.  If false, the actual
 *     intersection point will not be calculated.  If true and the segments
 *     intersect, the intersection point will be returned.  If true and
 *     the segments do not intersect, false will be returned.  If true and
 *     the segments are coincident, true will be returned.
 * tolerance - {Number} If a non-null value is provided, if the segments are
 *     within the tolerance distance, this will be considered an intersection.
 *     In addition, if the point option is true and the calculated intersection
 *     is within the tolerance distance of an end point, the endpoint will be
 *     returned instead of the calculated intersection.  Further, if the
 *     intersection is within the tolerance of endpoints on both segments, or
 *     if two segment endpoints are within the tolerance distance of eachother
 *     (but no intersection is otherwise calculated), an endpoint on the
 *     first segment provided will be returned.
 *
 * Returns:
 * {Boolean | <OpenLayers.Geometry.Point>}  The two segments intersect.
 *     If the point argument is true, the return will be the intersection
 *     point or false if none exists.  If point is true and the segments
 *     are coincident, return will be true (and the instersection is equal
 *     to the shorter segment).
 */
OpenLayers.Geometry.segmentsIntersect = function(seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if (d == 0) {
        // parallel
        if (n1 == 0 && n2 == 0) {
            // coincident
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if (along1 >= 0 && along1 <= 1 && along2 >= 0 && along2 <= 1) {
            // intersect
            if (!point) {
                intersection = true;
            } else {
                // calculate the intersection point
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new OpenLayers.Geometry.Point(x, y);
            }
        }
    }
    if (tolerance) {
        var dist;
        if (intersection) {
            if (point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                // check segment endpoints for proximity to intersection
                // set intersection to first endpoint within the tolerance
                outer: for (var i = 0; i < 2; ++i) {
                    seg = segs[i];
                    for (var j = 1; j < 3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(
                            Math.pow(x - intersection.x, 2) +
                            Math.pow(y - intersection.y, 2)
                        );
                        if (dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }

            }
        } else {
            // no calculated intersection, but segments could be within
            // the tolerance of one another
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            // check segment endpoints for proximity to intersection
            // set intersection to first endpoint within the tolerance
            outer: for (var i = 0; i < 2; ++i) {
                source = segs[i];
                target = segs[(i + 1) % 2];
                for (var j = 1; j < 3; ++j) {
                    p = {
                        x: source["x" + j],
                        y: source["y" + j]
                    };
                    result = OpenLayers.Geometry.distanceToSegment(p, target);
                    if (result.distance < tolerance) {
                        if (point) {
                            intersection = new OpenLayers.Geometry.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};

/**
 * Function: OpenLayers.Geometry.distanceToSegment
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with distance, along, x, and y properties.  The distance
 *     will be the shortest distance between the input point and segment.
 *     The x and y properties represent the coordinates along the segment
 *     where the shortest distance meets the segment. The along attribute
 *     describes how far between the two segment points the given point is.
 */
OpenLayers.Geometry.distanceToSegment = function(point, segment) {
    var result = OpenLayers.Geometry.distanceSquaredToSegment(point, segment);
    result.distance = Math.sqrt(result.distance);
    return result;
};

/**
 * Function: OpenLayers.Geometry.distanceSquaredToSegment
 *
 * Usually the distanceToSegment function should be used. This variant however
 * can be used for comparisons where the exact distance is not important.
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with squared distance, along, x, and y properties.
 *     The distance will be the shortest distance between the input point and
 *     segment. The x and y properties represent the coordinates along the
 *     segment where the shortest distance meets the segment. The along
 *     attribute describes how far between the two segment points the given
 *     point is.
 */
OpenLayers.Geometry.distanceSquaredToSegment = function(point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
        (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if (along <= 0.0) {
        x = x1;
        y = y1;
    } else if (along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
        x: x,
        y: y,
        along: along
    };
};

// create the model for orders and expose it to our app
module.exports = OpenLayers;