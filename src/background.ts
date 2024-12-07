// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToGithub',
    title: 'Save to GitHub',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'saveToGithub') {
    const selectedText = info.selectionText || '';
    // Store selected text
    await chrome.storage.local.set({ selectedText });
    
    // Trigger popup by clicking browser action
    chrome.action.openPopup();
  }
});