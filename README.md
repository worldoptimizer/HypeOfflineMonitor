
# Hype Offline Monitor
![HypeOfflineMonitor|690x487](https://playground.maxziebell.de/Hype/OfflineMonitor/HypeOfflineMonitor.jpg)

A lightweight **Tumult Hype** extension that keeps track of the browser’s connectivity state and the exact amount of time a visitor has been offline. The script exposes a handful of `hypeDocument.customData` variables—`isOnline`, `isOffline`, `offlineStartTime`, and granular `offlineDuration*` values—that update in real-time. Any Hype elements bound to those variables will _automatically redraw_ the moment their values change; if you prefer manual control, call `hypeDocument.trackOfflineTime()` whenever you want a refresh.

---

## Installation
1.  Download `HypeOfflineMonitor.js`.
2.  Open the **Resources** panel in your Hype document.
3.  Click the **"+"** button and choose **Add Resource…**, then select the `HypeOfflineMonitor.js` file.
4.  Ensure **"Auto-Link Resource"** is enabled (usually default) so Hype includes the script automatically in the `<head>` of your document.


## Quick start (use this inside a Hype function)

This would only run on the Hype event you bind this to, like a scene load or for a real-time update. Consider Using it with Hype Reactive Content. 

```javascript
function showOfflineBanner(hypeDocument, element, event) {
    // Check if the user is offline
    if (hypeDocument.customData.isOffline) {
        // Show the 'offlineGroup' element
        var offlineGroupElement = hypeDocument.getElementById('offlineGroup');
        if (offlineGroupElement) {
            offlineGroupElement.style.display = 'block';
        } else {
            console.warn("Element with ID 'offlineGroup' not found.");
        }

        // Retrieve offline duration from customData
        var h = hypeDocument.customData.offlineDurationHours;
        var m = hypeDocument.customData.offlineDurationMinutes;
        var s = hypeDocument.customData.offlineDurationSeconds;

        // Update the 'offlineDurationText' element with the offline duration
        var durationTextElement = hypeDocument.getElementById('offlineDurationText');
        if (durationTextElement) {
            durationTextElement.innerHTML = `Offline for: ${h.toFixed(2)} h (${m} m / ${s} s)`;
        } else {
            console.warn("Element with ID 'offlineDurationText' not found.");
        }

        // Log the offline duration
        if (typeof h === 'number' && typeof m === 'number' && typeof s === 'number') {
            console.log(`Offline for: ${h.toFixed(2)} h (${m} m / ${s} s)`);
        } else {
            console.warn("Offline duration data is missing or invalid.");
        }
    } else {
        console.log("User is online; no action taken.");
    }
}
```

### Using it with Hype Reactive Content

Bind any element’s inner HTML (data-content) or visibility (data-visibility) to the exposed variables and Hype will rerender instantly on each state change—no extra code needed.

---

## API reference

| Property / Method                                    | Type             | Description                                                             |
| ---------------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| **`hypeDocument.customData.isOnline`**               | `Boolean`        | `true` when the browser reports connectivity.                           |
| **`hypeDocument.customData.isOffline`**              | `Boolean`        | Convenience inverse of `isOnline`.                                      |
| **`hypeDocument.customData.offlineStartTime`**       | `Number \| null` | Epoch ms when the first disconnect occurred (stored in `localStorage`). |
| **`hypeDocument.customData.offlineDurationHours`**   | `Number`         | Hours offline, precise to 4 decimals.                                   |
| **`hypeDocument.customData.offlineDurationMinutes`** | `Number`         | Whole minutes offline.                                                  |
| **`hypeDocument.customData.offlineDurationSeconds`** | `Number`         | Whole seconds offline.                                                  |
| **`hypeDocument.trackOfflineTime()`**                | `Function`       | Manually recomputes and updates all of the above.                       |

---

## License

MIT © 2024 Max Ziebell. Free for commercial and open-source use.

