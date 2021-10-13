// options_tab = browser.runtime.getURL("/ui/pages/options_tab.html");
// document.getElementById("options").href = options_tab;

async function getActiveTabUrl() {
  let url = null;
  await browser.tabs.query({ active: true, currentWindow: true })
    .then(function (tabs) { url = tabs[0].url; });
  return new URL(url);
}


async function main() {
  await updateMemoryStorage();
  //get UI data
  let defaultMode = storage.defaultMode;
  let tabUrl = await getActiveTabUrl();
  let siteMode = storage[tabUrl.hostname];
  //load UI
  document.querySelector(`input[name="default"][value="${defaultMode}"]`).checked = true;
  if (siteMode === undefined) {
    document.querySelector(`input[name="website"][value="0"]`).checked = true;
  } else {
    document.querySelector(`input[name="website"][value="${siteMode}"]`).checked = true;
  }

  //watch UI for changes
  document.getElementById('default').addEventListener('change', function (e) {
    browser.storage.local.set({
      defaultMode: parseInt(e.target.value)
    });
    updateMemoryStorage();
    browser.runtime.sendMessage({ update: true });
  });

  document.getElementById('website').addEventListener('change', function (e) {
    let value = parseInt(e.target.value);
    if (value === 0) {
      browser.storage.local.remove(tabUrl.hostname);
    } else {
      browser.storage.local.set({
        [tabUrl.hostname]: value
      });
    }
    updateMemoryStorage();
    browser.runtime.sendMessage({ update: true });
  });
}



main();
