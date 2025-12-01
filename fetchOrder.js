async function fetchOrder(order) {
    try {
        const res = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return await res.json();
    } catch (err) {
        console.error("fetchOrder error:", err);
        throw err;
    }
}
