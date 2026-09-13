
export function valuesToMembers(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });

    return {
      id: obj.id || obj["roll no"] || obj["roll number"] || obj.roll || obj.rollno || obj.name,
      roll: obj.roll || obj["roll no"] || obj["roll number"] || obj.rollno || obj.id || "",
      name: obj.name || "",
      position: obj.position || obj.role || "",
      vertical: obj.vertical || obj.department || "",
      // "Year and class" header -> "year and class" key after lowercasing
      yearAndClass: obj["year and class"] || obj.year || obj.batch || obj.class || "",
      year: obj.year || obj["year and class"] || obj.batch || obj.class || "",
      photo: obj.photo || obj.url || obj.image || "",
      github: obj.github || "",
      linkedin: obj.linkedin || "",
      email: obj.email || "",
    };
  });
}