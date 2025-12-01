async function fetchUpdateSpaces(id, spaces) {
    try {
        await fetch(`http://localhost:3000/lessons/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaces })
        });
    } catch (err) {
        console.error("fetchUpdateSpaces error:", err);
    }
}
