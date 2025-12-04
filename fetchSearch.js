// Fetch search results from backend API
async function fetchSearch(query) {
    try {

        // Send a GET request to the server with the search query
        const res = await fetch(`https://full-stack-backend-agtz.onrender.com/search?query=${encodeURIComponent(query)}`);
        
        // Convert the server response to JSON format
        const data = await res.json();

        // Return the results while adjusting the image path for each lesson
        return data.map(lesson => ({
            ...lesson,                // Keep all original fields
            image: 'images/' + lesson.image   // Prepend local image folder path
        }));
    } catch (err) {

        // Log any error so we can debug the issue
        console.error("fetchSearch error:", err);

         // Return an empty array instead of crashing the app
        return [];
    }
}
