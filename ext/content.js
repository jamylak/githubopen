chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extract_data") {
    const pageData = {
      url: window.location.href
    };
    const branchElement = document.querySelector(".head-ref");
    if (branchElement)
      pageData.branch = branchElement.textContent;
    sendResponse(pageData);
  }
});
