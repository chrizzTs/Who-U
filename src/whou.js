/*
 * WhoU
 * 
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

(function ($) {

  // Collection method.
  $.fn.whou = function () {
    return this.each(function (i) {
      // Do something to each selected element.
      $(this).html('whou' + i);
    });
  };

  // Static method.
  $.whou = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.whou.options, options);
    // Return the name of your plugin plus a punctuation character.
    return 'whou' + options.punctuation;
  };

  // Static method default options.
  $.whou.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].whou = function (elem) {
    // Does this element contain the name of your plugin?
    return $(elem).text().indexOf('whou') !== -1;
  };

}(jQuery));
