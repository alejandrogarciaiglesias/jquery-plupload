/*
 * jQuery Plupload plugin
 *
 * @author Alejandro García Iglesias
 */

/*global jQuery, plupload */
(function ($, plupload) {
  'use strict';

  var Plupload = function (el, options) {
    /*jshint camelcase: false */
    var elementId;
    var overrideOptions = {};

    this.$el = $(el);

    // Element id & browse button.
    elementId = this.$el.attr('id');
    if (! elementId) {
      elementId = Math.random().toString(36).substring(2);
      this.$el.attr('id', elementId);
    }
    overrideOptions.browse_button = elementId;

    // Set options to instance.
    this.options = $.extend({}, options, overrideOptions);

    this.init();
  };

  Plupload.prototype.init = function () {
    // Init uploader.
    this.uploader = new plupload.Uploader(this.options);
    this.uploader.init();

    // Bind events.
    this.bindEvents();
  };

  Plupload.prototype.bindEvents = function () {
    var that = this;

    // File(s) selected event. Start upload.
    this.uploader.bind('FilesAdded', function (uploader) {
      uploader.start();
    });

    // Before upload event.
    this.uploader.bind('BeforeUpload', function (uploader, file) {
      if (typeof that.options.onBeforeUpload === 'function') {
        that.options.onBeforeUpload.call(that.$el.get(0), uploader, file);
      }
    });

    // Error event.
    this.uploader.bind('Error', function (uploader, error) {
      uploader.refresh(); // Reposition Flash/Silverlight

      if (typeof that.options.onError === 'function') {
        that.options.onError.call(that.$el.get(0), uploader, error);
      }
    });

    // Upload complete event.
    this.uploader.bind('FileUploaded', function (uploader, file, response) {
      if (typeof that.options.onFileUploaded === 'function') {
        that.options.onFileUploaded.call(that.$el.get(0), uploader, file, response);
      }
    });

    // Upload progress event.
    this.uploader.bind('UploadProgress', function (uploader, file) {
      if (typeof that.options.onUploadProgress === 'function') {
        that.options.onUploadProgress.call(that.$el.get(0), uploader, file);
      }
    });
  };

  /*
   * Register as jQuery plugin.
   */
  $.fn.plupload = function (options) {
    return this.each(function () {
      if (! $.data(this, 'plupload')) {
        $.data(this, 'plupload', new Plupload(this, options));
      }
    });
  };

}(jQuery, plupload));
