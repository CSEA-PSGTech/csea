import "dotenv/config";
import express from "express";
import cors from "cors";
import { fetchSheetValues } from "./googleSheets.js";
import { valuesToEvents } from "./mapSheetToEvent.js";
import { valuesToMembers } from "./mapSheetToMember.js";

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

app.get("/healthz", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Events API running on port ${PORT}`);
});