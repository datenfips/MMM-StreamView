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
    streams: [
      {
        title: 'title',
        src: 'http://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
        showTitle: true,
        loop: true,
        showDuration: true
      }
    ]
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
    setInterval(function() {
      self.updateDom();
    }, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
    var self = this;
    var streams = this.config.streams;
    if(streams.length > 0){
      for(stream in streams){

        var urlApi = stream.src;
        var retry = true;
    
        var dataRequest = new XMLHttpRequest();
        dataRequest.open("GET", urlApi, true);
        dataRequest.responseType = 'blob';
        dataRequest.onreadystatechange = function() {
          console.log(this.readyState);
          if (this.readyState === 4) {
            console.log(this.status);
            if (this.status === 200) {
              self.processData(JSON.parse(this.response));
            } else if (this.status === 401) {
              self.updateDom(self.config.animationSpeed);
              Log.error(self.name, this.status);
              retry = false;
            } else {
              Log.error(self.name, "Could not load data.");
            }
            if (retry) {
              self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
            }
          }
        };
        dataRequest.send();
      }
    }
    
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
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
      var videoBlob = this.dataRequest;
      var wrapperVideoRequest = document.createElement("video");
      wrapperVideoRequest.src = URL.createObjectURL(videoBlob); // IE10+
      wrapperVideoRequest.autoplay = true;
      wrapperVideoRequest.loop = true;

			var labelDataRequest = document.createElement("label");
			// Use translate function
			//             this id defined in translations files
			labelDataRequest.innerHTML = this.translate("TITLE");
			wrapper.appendChild(labelDataRequest);
			wrapper.appendChild(wrapperVideoRequest);
		}

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

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-StreamView-NOTIFICATION_TEST", data);
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
