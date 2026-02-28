import { baseUrls, SUBMIT_REQUEST, ARCHIVE_CACHED, WAYBACK_CACHED } from './urls.js';

const button = document.getElementById('reload-button');

button.addEventListener('click', function() {
    reload()
});

async function reload() {
    const { selectedUrl = Object.keys(baseUrls)[0] } = 
    await chrome.storage.sync.get("selectedUrl");

    const query = { active: true, lastFocusedWindow: true };  
    const currentTab = await chrome.tabs.query(query);
    const refUrl = currentTab[0].url;

    const reqType = baseUrls[selectedUrl];
    let url = new URL(`https://${selectedUrl}/`);
    if (reqType == ARCHIVE_CACHED || reqType == WAYBACK_CACHED) {
        url.pathname = refUrl;
    } else if (reqType == SUBMIT_REQUEST) {
        url.searchParams.set('url', refUrl);
    }

    chrome.tabs.update(currentTab.id, { url: url.href });
}