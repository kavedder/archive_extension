// ORIGINAL LICENSE
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// With some modifications by https://github.com/kavedder
// IDK do what you want 

import { baseUrls, SUBMIT_REQUEST, CACHED_VERISON } from './urls.js';

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  for (const [baseUrl, archiveMode] of Object.entries(baseUrls)) {
    chrome.contextMenus.create({
      id: baseUrl,
      title: archiveMode,
      type: 'normal',
      contexts: ['selection']
    });
  }
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const refUrl = item.linkUrl;
  const baseUrl = item.menuItemId;
  const reqType = baseUrls[baseUrl];
  var url = new URL(`https://${baseUrl}/`);
  console.log(`refUrl: ${refUrl} | reqType: ${reqType} | baseUrl: ${baseUrl}`)
  if (reqType == CACHED_VERISON) {
    url = new URL(`https://${baseUrl}/${refUrl}`);
  } else if (reqType == SUBMIT_REQUEST) {
    url.searchParams.set('url', refUrl);
  }
  
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

// Add or removes the request type from context menu
// when the user checks or unchecks the request type in the popup
chrome.storage.onChanged.addListener(({ enabledUrls }) => {
  if (typeof enabledUrls === 'undefined') return;

  const allUrls = Object.keys(baseUrls);
  const currentUrls = new Set(enabledUrls.newValue);
  const oldUrls = new Set(enabledUrls.oldValue ?? allUrls);
  const changes = allUrls.map((baseUrl) => ({
    baseUrl: baseUrl,
    added: currentUrls.has(baseUrl) && !oldUrls.has(baseUrl),
    removed: !currentUrls.has(baseUrl) && oldUrls.has(baseUrl)
  }));

  for (const { baseUrl, added, removed } of changes) {
    if (added) {
      chrome.contextMenus.create({
        id: baseUrl,
        title: baseUrls[baseUrl],
        type: 'normal',
        contexts: ['selection']
      });
    } else if (removed) {
      chrome.contextMenus.remove(baseUrl);
    }
  }
});
