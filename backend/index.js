import "dotenv/config";
import express from "express";
import cors from "cors";
import { fetchSheetValues } from "./googleSheets.js";
import { valuesToEvents } from "./mapSheetToEvent.js";
import { valuesToMembers } from "./mapSheetToMember.js";
import { valuesToBlogs, findBlogById } from "./mapSheetToBlog.js";
import { fetchDocHtml } from "./googleDocs.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

const BLOGS_RANGE = process.env.GSHEET_BLOGS_RANGE;


app.get("/api/events", async (req, res) => {
  try {
    const values = await fetchSheetValues(process.env.GSHEET_EVENTS_RANGE || "Events!A1:H1000");
    const events = valuesToEvents(values);
    res.json({ events });
  } catch (err) {
    console.error("Failed to fetch events:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/members", async (req, res) => {
  try {
    const values = await fetchSheetValues(process.env.GSHEET_MEMBERS_RANGE || "Members!A1:F300");
    const members = valuesToMembers(values);
    res.json({ members });
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    if (!BLOGS_RANGE) {
      throw new Error("Missing GSHEET_BLOGS_RANGE in .env");
    }
 
    const values = await fetchSheetValues(BLOGS_RANGE);
    const blogs = valuesToBlogs(values);
 
    // Most-recent-first when `date` parses cleanly; otherwise leave
    // sheet order untouched (same non-destructive fallback approach
    // as elsewhere — don't assume a date format that might not hold).
    const sorted = [...blogs].sort((a, b) => {
      const da = Date.parse(a.date);
      const db = Date.parse(b.date);
      if (Number.isNaN(da) || Number.isNaN(db)) return 0;
      return db - da;
    });
 
    // List view only needs the excerpt, not each post's full body —
    // don't fetch every linked Google Doc here (would be N Drive API
    // calls per page load). docLink is dropped from the response since
    // the frontend list card has no use for it; keep it out to avoid
    // exposing internal Doc URLs unnecessarily.
    const listBlogs = sorted.map(({ docLink, ...rest }) => rest);
 
    res.json({ blogs: listBlogs });
  } catch (err) {
    console.error("GET /api/blogs failed:", err);
    res.status(500).json({ error: err.message });
  }
});
 
app.get("/api/blogs/:id", async (req, res) => {
  try {
    if (!BLOGS_RANGE) {
      throw new Error("Missing GSHEET_BLOGS_RANGE in .env");
    }
 
    const values = await fetchSheetValues(BLOGS_RANGE);
    const blogs = valuesToBlogs(values);
    const blog = findBlogById(blogs, req.params.id);
 
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }
 
    // Single-post view: fetch the actual article body from the linked
    // Google Doc. If the Doc fetch fails (unshared doc, bad link,
    // etc.), don't fail the whole request — fall back to the sheet's
    // excerpt so the page still renders something instead of a 500.
    let content = "";
    try {
      content = blog.docLink ? await fetchDocHtml(blog.docLink) : "";
    } catch (docErr) {
      console.error(`Failed to fetch Doc content for blog "${blog.id}":`, docErr);
      content = "";
    }
 
    const { docLink, ...blogWithoutLink } = blog;
    res.json({
      blog: {
        ...blogWithoutLink,
        content: content || blog.excerpt || "",
      },
    });
  } catch (err) {
    console.error(`GET /api/blogs/${req.params.id} failed:`, err);
    res.status(500).json({ error: err.message });
  }
});
 

app.get("/healthz", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Events API running on port ${PORT}`);
});