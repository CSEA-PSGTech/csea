import { JWT } from "google-auth-library";

// Mirrors googleSheets.js's auth pattern, but needs Drive read scope
// (not Sheets scope) to call the export endpoint below. Kept as a
// separate cached client rather than reusing googleSheets.js's client
// directly, since that one is scoped only to spreadsheets.readonly and
// widening its scope there would be a silent behavior change to an
// existing, working file.

let cachedDocsClient = null;

function getDocsAuthClient() {
  if (cachedDocsClient) return cachedDocsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env"
    );
  }

  const key = rawKey.replace(/\\n/g, "\n");

  cachedDocsClient = new JWT({
    email,
    key,
    // Note: the Doc must be shared with this service account's email
    // (Viewer access) for the export call below to succeed — same
    // requirement as sharing the Sheet for fetchSheetValues().
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return cachedDocsClient;
}

// Accepts either a raw Doc ID or a full Google Docs URL, e.g.:
//   https://docs.google.com/document/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
export function extractDocId(linkOrId) {
  if (!linkOrId) return null;

  const match = String(linkOrId).match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Already looks like a bare ID (no slashes/protocol) — use as-is.
  if (/^[a-zA-Z0-9_-]+$/.test(linkOrId)) return linkOrId;

  return null;
}

// Fetches the Doc's content as HTML via Drive's export endpoint.
// Returns a string of HTML (headings, paragraphs, bold/italic, links,
// lists, etc. are preserved by Docs' own HTML export).
export async function fetchDocHtml(linkOrId) {
  const docId = extractDocId(linkOrId);
  if (!docId) {
    throw new Error(`Could not extract a Google Doc ID from: ${linkOrId}`);
  }

  const auth = getDocsAuthClient();
  const { token } = await auth.getAccessToken();

  const url = `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=text/html`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Drive export failed for doc ${docId}: status ${res.status} ${body.slice(0, 200)}`
    );
  }

  return res.text();
}