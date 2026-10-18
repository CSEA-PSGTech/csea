

const txt = (c) => (typeof c === "string" ? c : c?.text ?? "");

export function valuesToTimeline(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => txt(h).trim().toLowerCase());

  return values.slice(1).map((row, i) => {
    const obj = {};
    const rich = {};
    headers.forEach((header, idx) => {
      obj[header] = txt(row[idx]).trim();
      rich[header] = row[idx];
    });

    if (!obj.title && !obj.description && !obj.photo1) return null;

    const descCell = rich.description;
    return {
      id: obj.id || String(i + 1),
      rowIndex: i,
      title: obj.title || "",
      date: obj.date || "",
      description: obj.description || "",
      descriptionParts:
        descCell && typeof descCell === "object"
          ? descCell.parts
          : [{ text: obj.description || "", href: null }],
      preview: obj.photo1 || "",
    };
  }).filter(Boolean);
}