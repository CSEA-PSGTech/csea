


function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function valuesToBlogs(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });

    const rawId = obj.id || obj.title;

    return {
      id: obj.id ? slugify(obj.id) : slugify(rawId),
      title: obj.title || "",
      author: obj.author || "",
      date: obj.date || "",
      excerpt: obj.excerpt || "",
      docLink: obj.content || "",
      preview: obj.preview || "",
      yearAndClass: obj.yearandclass || "",
    };
  });
}

// Convenience for GET /api/blogs/:id — filters the mapped list down to
// a single blog by its (slugified) id.
export function findBlogById(blogs, id) {
  return blogs.find((b) => b.id === id) || null;
}