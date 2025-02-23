function sendUrlToServer(tab) {
  if (tab.url) {
    fetch("http://localhost:5555/receive-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: tab.url })
    })
    .then(response => console.log("URL sent successfully"))
    .catch(error => console.error("Error sending URL:", error));
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "send_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        sendUrlToServer(tabs[0]);
      }
    });
  }
});
