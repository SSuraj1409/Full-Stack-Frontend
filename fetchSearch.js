
async function fetchSearch(query) {
    try {
        const res = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        return data.map(lesson => ({
            ...lesson,
            image: 'images/' + lesson.image   
        }));
    } catch (err) {
        console.error("fetchSearch error:", err);
        return [];
    }
}
