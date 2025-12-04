
// Fetch all lessons from the backend API
async function fetchLessons() {
  // Send a GET request to the /lessons route on your server
  const res = await fetch('https://full-stack-backend-agtz.onrender.com/lessons');

  // Convert the server response to JSON format
  const data = await res.json();

  // Map through each lesson and fix the image path
  return data.map(lesson => ({
    ...lesson,    // Keep all original fields
    image: 'https://full-stack-backend-agtz.onrender.com/images/' + lesson.image  // Add correct local image folder path
  }));
}
