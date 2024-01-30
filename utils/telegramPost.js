export function sendFeedbackToServer(feedbackData) {
  const serverUrl = 'https://zparkbackend.onrender.com/sendFeedback';
  
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log('Server response:', data))
      .catch(error => console.error('Error sending feedback to server:', error.message));
  }
  
export function sendFeedbackToChanel(feedbackData) {
    const serverUrl = 'https://zparkbackend.onrender.com/sendMessage';
  
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log('Server response:', data))
      .catch(error => console.error('Error sending feedback to server:', error.message));
}
  