chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extract_data") {
    const pageData = {
      url: window.location.href
    };
    const branchElement = document.querySelector(".head-ref");
    if (branchElement)
      pageData.branch = branchElement.textContent;
    else {
      // For the commits page on PR eg.
      // https://github.com/ghostty-org/ghostty/pull/5681/commits
      // it doesn't use .head-ref
      const fromCommitAnchor = Array.from(document.querySelectorAll("span")).find(span => span.textContent == "from ");
      if (fromCommitAnchor)
        pageData.branch = fromCommitAnchor.nextElementSibling.getElementsByTagName('a')[0].textContent;
    }

    sendResponse(pageData);
  }
});
