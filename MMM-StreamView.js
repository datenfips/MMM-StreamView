/* global Module */

/* Magic Mirror
 * Module: MMM-StreamView
 *
 * By Philipp Siegmund
 * MIT Licensed.
 */

Module.register("MMM-StreamView", {
	defaults: {
		updateInterval: 300000, // 5min = 300000ms
    retryDelay: 5000,
    title: 'title',
    src: 'http://192.168.0.242:8080/modules/MMM-StreamView/public/placeholder/SampleVideo_1280x720_1mb.mp4',
    showTitle: true,
    loop: true,
    showDuration: true
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
    setInterval(function() {
      self.updateDom();
    }, this.config.updateInterval);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.updateDom();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

    var videoBlob = this.dataRequest;
    var wrapperVideoRequest = document.createElement("video");
    wrapperVideoRequest.src = this.config.src; // IE10+
    wrapperVideoRequest.loop = this.config.loop;
    wrapperVideoRequest.autoplay = true;

    var labelDataRequest = document.createElement("label");
    // Use translate function
    //             this id defined in translations files
    labelDataRequest.innerHTML = this.translate("TITLE");
    wrapper.appendChild(labelDataRequest);
    wrapper.appendChild(wrapperVideoRequest);

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-StreamView.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/de.json"
		};
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-StreamView-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
