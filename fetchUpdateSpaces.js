// Update the available spaces for a specific lesson
async function fetchUpdateSpaces(id, spaces) {
    try {

        // Send a PUT request to update a lesson's "spaces" field
        await fetch(`https://full-stack-backend-agtz.onrender.com/lessons/${id}`, {
            method: 'PUT',            // PUT = update existing data
            headers: { 'Content-Type': 'application/json' },   // Sending JSON data
            body: JSON.stringify({ spaces })                   // Convert JS object → JSON string
        });
    } catch (err) {

        // Print the error for debugging
        console.error("fetchUpdateSpaces error:", err);
    }
}
