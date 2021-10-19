client.runtime.onInstalled.addListener(function () {
  client.storage.local.set({
    defaultMode: MODES.ALLOW_AUDIO_AND_VIDEO
  }, updateMemoryStorage);
});


client.runtime.onMessage.addListener(updateMemoryStorage)


function getCurrentMode(hostname) {
  let hostnameMode = storage[hostname];
  if (hostnameMode !== undefined) {
    return hostnameMode;
  }
  let defaultMode = storage.defaultMode;
  return defaultMode;
}



client.webRequest.onHeadersReceived.addListener(function (details) {
  for (const header of details.responseHeaders) {
    if (header.name.toLowerCase() === 'content-type') {
      let type = header.value;
      let videoMatch = type.search(/video/i) >= 0;
      let audioMatch = type.search(/audio/i) >= 0;
      if (!videoMatch && !audioMatch) {
        return;
      }
      //at this point, the request IS a target
      let url = null;
      if (typeof browser !== "undefined" && typeof chrome !== "undefined") {
        //firefox
        url = details?.frameAncestors[0]?.url ?? details.originUrl ?? details.url;
      } else {
        //chrome / edge
        url = details.initiator;
      }
      url = new URL(url);
      let currentMode = getCurrentMode(url.hostname);
      if (currentMode === MODES.ALLOW_AUDIO_AND_VIDEO) {
        return;
      }
      //mode: block...something!
      //so, video is blocked regardless
      if (videoMatch) {
        return {
          cancel: true
        };
      }
      //audio match
      if (currentMode === MODES.BLOCK_VIDEO_ONLY) {
        return;
      }
      //audio match & mode: block audio and video
      return {
        cancel: true
      };
    }
  }
},
  {
    urls: ["<all_urls>"]
  },
  ["blocking", "responseHeaders"]
);
