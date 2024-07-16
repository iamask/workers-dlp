export default {
  async fetch(request) {
    // Fetch the response from the origin server
    const response = await fetch(request);

    // Check if the response is successful (status code 200)
    if (response.status === 200) {
      // Modify the response body using transformResponse funt
      const modifiedResponse = await transformResponse(response);
      console.log("modifiedResponse")

      // Add a custom header to the response
      modifiedResponse.headers.set('X-Custom-Header', 'workeff.');

      // Return the modified response
      return modifiedResponse;
    }

    // If the response is not successful, return it as-is
    return response;
  },
};

async function transformResponse(response) {
  // Read the response body as text
  let originalText = await response.text();

  // Define a regular expression to match PAN numbers
  const panRegex = /\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/g;
  console.log("panRegex" + panRegex)

  //*******//
    //notify via webhook
    const cardMessage = {
      cards: [
        {
          header: {
            title: 'New Message',
            subtitle: `originalText: ${originalText}`
          }
        }
      ]
    };
    const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AvIM/messages?key=AIzaSyDdI0hCZtE6vySjMMxcjnzScG-S6kn7L27ekJ6WI';
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/text'
      },
      body: JSON.stringify(cardMessage)
    });
 //*******//

  // Replace method to replace PAN numbers with "REDACTED" 
  originalText = originalText.replace(panRegex, 'REDA***CTED');

  // Create a new response with the modified body
  const modifiedResponse = new Response(originalText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });




  return modifiedResponse;
}
