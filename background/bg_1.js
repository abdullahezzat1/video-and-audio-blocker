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
    blockByDefault: true,
    whiteList: [
      'www.beinsports.com',
      'classroom.udacity.com'
    ],
    blackList: [],
  });

  let storage = await browser.storage.local.get();
  storage.whiteList = new Set(storage.whiteList);
  storage.blackList = new Set(storage.blackList);

  browser.webRequest.onHeadersReceived.addListener(function (details) {
    for (const header of details.responseHeaders) {
      if (header.name.toLowerCase() === 'content-type') {
        let type = header.value;
        let url = '';
        let oppositeSet = null;
        let blockByDefault = true;
        if (type.search(/video/i) >= 0 || type.search(/audio/i) >= 0) {
          url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          blockByDefault = storage.blockByDefault;
          oppositeSet = blockByDefault === true ? storage.whiteList : storage.blackList;
        } else {
          return;
        }
        if (shouldBeBlocked(url.hostname, blockByDefault, oppositeSet)) {
          return {
            cancel: true
          };
        } else {
          return;
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


main();
