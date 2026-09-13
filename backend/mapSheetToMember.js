
export function valuesToMembers(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });

    return {
      id: obj.id || obj.name,
      name: obj.name || "",
      position: obj.position || "",
      vertical: obj.vertical || "",
      // "Year and class" header -> "year and class" key after lowercasing
      yearAndClass: obj["year and class"] || "",
      // Rename to "url" (not "photo") if you wire this into
      // AccordionModal or another component expecting that field.
      photo: obj.photo || "",
    };
  });
}