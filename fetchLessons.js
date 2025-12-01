
async function fetchLessons() {
 
  const res = await fetch('http://localhost:3000/lessons');
  const data = await res.json();

  return data.map(lesson => ({
    ...lesson,
    image: 'images/' + lesson.image  
  }));
}
