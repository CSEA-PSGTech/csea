

export function valuesToEvents(values) {
  if (!values || values.length === 0) return [];
 
  const headers = values[0].map((h) => (h || "").trim().toLowerCase());
 
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });
 
    return {
      id: obj.id || obj.title,
      title: obj.title || "",
      category: obj.category || "",
      date: obj.date || "",
      venue: obj.venue || "",
      status: obj.status || "",
      description: obj.description || "",
      url: obj.photo1 || "",
      registrationLink: obj.registrationlink || "",
    };
  });
}
 