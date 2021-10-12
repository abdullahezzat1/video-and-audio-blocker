function shouldBeBlocked(hostname, blockByDefault, list) {
  if (blockByDefault) {
    if (list.indexOf(hostname) >= 0) {
      return false;
    } else {
      return true;
    }
  } else {
    if (list.indexOf(hostname) >= 0) {
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
      whiteList: [],
      blackList: []
    }
  });

  let storage = await browser.storage.local.get();

  browser.webRequest.onHeadersReceived.addListener(function (details) {
    for (const header of details.responseHeaders) {
      if (header.name.toLowerCase() === 'content-type') {
        let type = header.value;
        let url = '';
        let oppositeList = null;
        let blockByDefault = true;
        if (type.search(/video/i) >= 0) {
          url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          blockByDefault = storage.video.blockByDefault;
          oppositeList = blockByDefault === true ? storage.video.whiteList : storage.video.blackList;
        } else if (type.search(/audio/i) >= 0) {
          url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          blockByDefault = storage.audio.blockByDefault;
          oppositeList = blockByDefault === true ? storage.audio.whiteList : storage.audio.blackList;
        } else {
          return;
        }
        if (shouldBeBlocked(url.hostname, blockByDefault, oppositeList)) {
          return {
            cancel: true,
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
