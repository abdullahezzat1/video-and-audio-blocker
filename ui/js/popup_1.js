// options_tab = client.runtime.getURL("/ui/pages/options_tab.html");
// document.getElementById("options").href = options_tab;

let url = null;


function sub(tabs) {
  url = tabs[0].url;
  url = new URL(url);
  client.storage.local.get(main);
}

function main(result) {
  storage = result;
  //get UI data
  let defaultMode = storage.defaultMode;
  let tabUrl = url;
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
    client.storage.local.set({
      defaultMode: parseInt(e.target.value)
    });
    // updateMemoryStorage();
    client.runtime.sendMessage({ update: true });
  });

  document.getElementById('website').addEventListener('change', function (e) {
    let value = parseInt(e.target.value);
    if (value === 0) {
      client.storage.local.remove(tabUrl.hostname);
    } else {
      client.storage.local.set({
        [tabUrl.hostname]: value
      });
    }
    // updateMemoryStorage();
    client.runtime.sendMessage({ update: true });
  });
}




client.tabs.query({ active: true, currentWindow: true }, sub);
