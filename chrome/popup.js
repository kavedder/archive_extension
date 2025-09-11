// ORIGINAL LICENSE
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// With some modifications by https://github.com/kavedder
// IDK do what you want 

import { baseUrls } from './urls.js';

createForm().catch(console.error);

async function createForm() {
  const { enabledUrls = Object.keys(baseUrls) } =
    await chrome.storage.sync.get('enabledUrls');
  const checked = new Set(enabledUrls);

  const form = document.getElementById('form');
  for (const [archiveMode, baseUrl] of Object.entries(baseUrls)) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked.has(archiveMode);
    checkbox.name = archiveMode;
    checkbox.addEventListener('click', (event) => {
      handleCheckboxClick(event).catch(console.error);
    });

    const span = document.createElement('span');
    span.textContent = baseUrl;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(span);

    form.appendChild(div);
  }
}

async function handleCheckboxClick(event) {
  const checkbox = event.target;
  const baseUrl = checkbox.name;
  const enabled = checkbox.checked;

  const { enabledUrls = Object.keys(baseUrls) } =
    await chrome.storage.sync.get('enabledUrls');
  const urlSet = new Set(enabledUrls);

  if (enabled) urlSet.add(baseUrl);
  else urlSet.delete(baseUrl);

  await chrome.storage.sync.set({ enabledUrls: [...urlSet] });
}
