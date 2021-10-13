options_tab = browser.runtime.getURL("/ui/pages/options_tab.html");
document.getElementById("options").href = options_tab;


async function getActiveTabUrl() {
  let url = null;
  await browser.tabs.query({ active: true, currentWindow: true })
    .then(function (tabs) { url = tabs[0].url; });
  return new URL(url);
}


async function main() {
  //get UI data
  let defaultMode = await browser.storage.local.get("defaultMode");
  defaultMode = defaultMode.defaultMode;
  let tabUrl = await getActiveTabUrl();
  let siteMode = await browser.storage.local.get(tabUrl.hostname);
  siteMode = siteMode[tabUrl.hostname];
  //set UI data
  document.querySelector(`input[name="default"][value="${defaultMode}"]`).checked = true;
  if (siteMode === undefined) {
    document.querySelector(`input[name="website"][value="0"]`).checked = true;
  } else {
    document.querySelector(`input[name="website"][value="${siteMode}"]`).checked = true;
  }

  //watch UI for changes
  document.querySelector(`input[name="default"][value="${MODES.ALLOW_AUDIO_AND_VIDEO}"]`)
    .addEventListener('')

  //update settings

}



main();
