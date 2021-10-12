function shouldBeBlocked(hostname, blockByDefault, oppositeSet) {
  console.log(hostname);
  if (blockByDefault) {
    if (oppositeSet.has(hostname)) {
      return false;
    } else {
      return true;
    }
  } else {
    if (oppositeSet.has(hostname)) {
      return true;
    } else {
      return false;
    }
  }
}


async function main() {
  await browser.storage.local.set({
    video: {
      blockByDefault: true,
      whiteList: [
        'www.beinsports.com',
        'classroom.udacity.com'
      ],
      blackList: [],
    },
    audio: {
      blockByDefault: true,
      whiteList: [
        'classroom.udacity.com'
      ],
      blackList: []
    }
  });

  let storage = await browser.storage.local.get();
  storage.video.whiteList = new Set(storage.video.whiteList);
  storage.video.blackList = new Set(storage.video.blackList);
  storage.audio.whiteList = new Set(storage.audio.whiteList);
  storage.audio.blackList = new Set(storage.audio.blackList);

  browser.webRequest.onHeadersReceived.addListener(function (details) {
    for (const header of details.responseHeaders) {
      if (header.name.toLowerCase() === 'content-type') {
        let type = header.value;
        let url = '';
        let oppositeSet = null;
        let blockByDefault = true;
        if (type.search(/video/i) >= 0) {
          url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          blockByDefault = storage.video.blockByDefault;
          oppositeSet = blockByDefault === true ? storage.video.whiteList : storage.video.blackList;
        } else if (type.search(/audio/i) >= 0) {
          url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          blockByDefault = storage.audio.blockByDefault;
          oppositeSet = blockByDefault === true ? storage.audio.whiteList : storage.audio.blackList;
        } else {
          return {
            cancel: false
          };
        }
        if (shouldBeBlocked(url.hostname, blockByDefault, oppositeSet)) {
          return {
            cancel: true
          };
        } else {
          return {
            cancel: false
          };
        }
      }
    }
  },
    {
      urls: ["<all_urls>"]
    },
    ["blocking", "responseHeaders"]
  );

}


main()
