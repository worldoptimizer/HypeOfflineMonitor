/*!
 * Hype Offline Monitor v1.0.6
 * Copyright (2024) Max Ziebell. MIT-license
 */

/*
 * Version-History
 * 1.0.0 Initial release under MIT-license
 * 1.0.1 Added online/offline event listeners to track state changes
 * 1.0.2 Added interval timer to continuously update offline status if offline
 * 1.0.3 Added isOnline and isOffline customData variables for tracking state
 * 1.0.4 Fixed compatibility issue with other extensions probing scenes
 * 1.0.5 Fixed the total elapsed time instead of the units from the clock hand
 * 1.0.6 Refactored name to HypeOfflineMonitor
 */

if ("HypeOfflineMonitor" in window === false) {
	window['HypeOfflineMonitor'] = (function () {

		let intervalId = null;

		function trackOfflineTime(hypeDocument) {
			const isOnline = window.navigator.onLine;

			hypeDocument.customData.isOnline = isOnline;
			hypeDocument.customData.isOffline = !isOnline;

			if (!isOnline) {
				let offlineStartTime = localStorage.getItem('offlineStartTime');
				
				if (!offlineStartTime) {
					offlineStartTime = Date.now();
					localStorage.setItem('offlineStartTime', offlineStartTime);
				}

				hypeDocument.customData.offlineStartTime = offlineStartTime;

				const { hours, minutes, seconds } = calculateOfflineDuration(offlineStartTime);

				hypeDocument.customData.offlineDurationHours = hours;
				hypeDocument.customData.offlineDurationMinutes = minutes;
				hypeDocument.customData.offlineDurationSeconds = seconds;

				if (!intervalId) {
					intervalId = setInterval(() => trackOfflineTime(hypeDocument), 100);
				}

			} else {
				localStorage.removeItem('offlineStartTime');
				hypeDocument.customData.offlineStartTime = null;
				hypeDocument.customData.offlineDurationHours = 0;
				hypeDocument.customData.offlineDurationMinutes = 0;
				hypeDocument.customData.offlineDurationSeconds = 0;

				if (intervalId) {
					clearInterval(intervalId);
					intervalId = null;
				}
			}
		}

		function calculateOfflineDuration(offlineStartTime) {
			const now = Date.now();
			const durationMilliseconds = now - offlineStartTime;
		
			const seconds = Math.floor(durationMilliseconds / 1000);
			const minutes = Math.floor(durationMilliseconds / (1000 * 60));
			const hours = parseFloat((durationMilliseconds / (1000 * 60 * 60)).toFixed(4));
			
			return {
				hours: hours,
				minutes: minutes,
				seconds: seconds,
			};
		}


		function handleOnlineOfflineEvents(hypeDocument) {
			window.addEventListener('online', () => trackOfflineTime(hypeDocument));
			window.addEventListener('offline', () => trackOfflineTime(hypeDocument));
		}

		function HypeDocumentLoad(hypeDocument, element, event) {
			hypeDocument.trackOfflineTime = function() {
				trackOfflineTime(hypeDocument);
			};

			trackOfflineTime(hypeDocument);

			handleOnlineOfflineEvents(hypeDocument);
		}

		function HypeScenePrepareForDisplay(hypeDocument, element, event) {
			trackOfflineTime(hypeDocument);
		}

		if ("HYPE_eventListeners" in window === false) {
			window.HYPE_eventListeners = Array();
		}
		window.HYPE_eventListeners.push({ "type": "HypeDocumentLoad", "callback": HypeDocumentLoad });
		window.HYPE_eventListeners.push({ "type": "HypeScenePrepareForDisplay", "callback": HypeScenePrepareForDisplay });

		return {
			version: '1.0.6',
			trackOfflineTime: trackOfflineTime
		};

	})();
} 
