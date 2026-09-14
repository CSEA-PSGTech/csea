

export function valuesToTimeline(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row, i) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (row[idx] ?? "").toString().trim();
    });

    // Skip fully blank rows (trailing empty rows from the sheet range).
    if (!obj.title && !obj.description && !obj.photo1) return null;

    return {
      id: obj.id || String(i + 1),
      rowIndex: i, // stable, always-unique fallback key for the frontend
      title: obj.title || "",
      date: obj.date || "",
      description: obj.description || "",
      preview: obj.photo1 || "",
    };
  }).filter(Boolean);
}