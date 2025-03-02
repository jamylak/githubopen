function sendDataToServer(data) {
  console.log("Sending data: ", data);
  fetch("http://localhost:5555/receive-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => console.log("Data sent successfully"))
  .catch(error => console.error("Error sending data:", error));
}

chrome.commands.onCommand.addListener((command) => {
  console.log("Get from tab");
  if (command === "send_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extract_data" }, (response) => {
          if (response) {
            console.log("Send response", response);
            sendDataToServer(response);
          }
        });
      }
    });
  }
});
