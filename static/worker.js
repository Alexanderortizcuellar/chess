// apiWorker.js

// Listen for messages from the main script
self.addEventListener('message', async (event) => {
  const data  = event.data;

  try {
    const response = await fetch("/eval", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // Send the response data back to the main script
    self.postMessage({ success: true, data: responseData });
  } catch (error) {
    // Send an error message back to the main script
    self.postMessage({ success: false, error: error.message });
  }
});

