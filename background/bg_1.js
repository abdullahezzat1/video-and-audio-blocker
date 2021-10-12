let tempUrls = new Set();
tempUrls.add('www.dailymotion.com');
tempUrls.add('www.youtube.com');


function shouldBeBlocked(hostname) {
  console.log(hostname);
  if (tempUrls.has(hostname)) {
    return true;
  } else {
    return false;
  }
}


client.webRequest.onHeadersReceived.addListener(
  function (details) {
    for (const header of details.responseHeaders) {
      if (header.name.toLowerCase() === 'content-type') {
        let type = header.value;
        if (
          type.search(/audio/i) >= 0
          || type.search(/video/i) >= 0
        ) {
          let url = details?.frameAncestors[0]?.url ?? details.originUrl;
          url = new URL(url);
          if (shouldBeBlocked(url.hostname)) {
            return {
              cancel: true,
            };
          }
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



