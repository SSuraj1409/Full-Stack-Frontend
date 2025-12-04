// Send an order to the backend API (POST request)
async function fetchOrder(order) {
    try {
        // Send the order data to the /orders route on your server
        // method: 'POST' → we are creating/saving new order data
        const res = await fetch('https://full-stack-backend-agtz.onrender.com/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Sending JSON data
            body: JSON.stringify(order)                      // Convert JS object → JSON string
        });

        // Return the server's response as JSON
        return await res.json();
    } catch (err) {

        // Print the error for debugging
        console.error("fetchOrder error:", err);

        // Re-throw the error so the calling function can handle it
        throw err;
    }
}
