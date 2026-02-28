import { baseUrls } from "./urls.js";

createSelect().catch(console.error);

async function createSelect() {
    const { selectedUrl = Object.keys(baseUrls)[0] } = 
    await chrome.storage.sync.get("selectedUrl");

    const select = document.getElementById("reload-select");
    for (const [baseUrl, archiveMode] of Object.entries(baseUrls)) {
        const option = document.createElement("option");
        option.value = baseUrl;
        option.textContent = archiveMode;
        if (baseUrl == selectedUrl) {
            option.setAttribute("selected", true)
        }
        select.appendChild(option);
    }
    select.addEventListener('change', (event) => {
        handleDropdownChange(event).catch(console.error);
    });
}

async function handleDropdownChange(event) {
    const selectedValue = event.target.value;
    await chrome.storage.sync.set({ selectedUrl: selectedValue });
}