import { JWT } from "google-auth-library";
 

 
let cachedClient = null;
 
function getAuthClient() {
  if (cachedClient) return cachedClient;
 
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
 
  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env"
    );
  }
 
  const key = rawKey.replace(/\\n/g, "\n");
 
  cachedClient = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
 
  return cachedClient;
}
 
// range: e.g. "Events!A1:H1000" or "Members!A1:F300"
export async function fetchSheetValues(range) {
  const sheetId = process.env.GSHEET_ID;
 
  if (!sheetId) {
    throw new Error("Missing GSHEET_ID in .env");
  }
  if (!range) {
    throw new Error("fetchSheetValues() requires a range argument, e.g. 'Members!A1:F300'");
  }
 
  const auth = getAuthClient();
  const { token } = await auth.getAccessToken();
 
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
    range
  )}`;
 
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const reason = body?.error?.message || `status ${res.status}`;
    throw new Error(`Sheets API request failed: ${reason}`);
  }
 
  const data = await res.json();
  return data.values || [];
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

// Fallback: also auto-link any bare https:// URLs typed as plain text
function autoLink(parts) {
  return parts.flatMap((p) =>
    p.href
      ? [p]
      : p.text.split(URL_RE).filter(Boolean).map((t) =>
          URL_RE.test(t) ? { text: t, href: t } : { text: t, href: null }
        )
  );
}

// Turn one API cell into { text, parts: [{ text, href }] }
function cellToRich(cell) {
  const text = cell?.formattedValue ?? "";
  const runs = cell?.textFormatRuns;
  let parts;

  if (runs && runs.length) {
    parts = [];
    const first = runs[0].startIndex ?? 0;
    if (first > 0) parts.push({ text: text.slice(0, first), href: null });
    runs.forEach((r, i) => {
      const start = r.startIndex ?? 0;
      const end = runs[i + 1]?.startIndex ?? text.length;
      parts.push({ text: text.slice(start, end), href: r.format?.link?.uri || null });
    });
  } else if (cell?.hyperlink) {
    // whole-cell link or =HYPERLINK()
    parts = [{ text, href: cell.hyperlink }];
  } else {
    parts = [{ text, href: null }];
  }

  return { text, parts: autoLink(parts.filter((p) => p.text)) };
}

// Same idea as fetchSheetValues, but keeps hyperlinks
export async function fetchSheetRichValues(range) {
  const sheetId = process.env.GSHEET_ID;
  if (!sheetId) throw new Error("Missing GSHEET_ID in .env");
  if (!range) throw new Error("fetchSheetRichValues() requires a range");

  const auth = getAuthClient();
  const { token } = await auth.getAccessToken();

  const fields =
    "sheets.data.rowData.values(formattedValue,hyperlink,textFormatRuns(startIndex,format/link/uri))";

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}` +
    `?ranges=${encodeURIComponent(range)}` +
    `&includeGridData=true&fields=${encodeURIComponent(fields)}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`Sheets API request failed: ${body?.error?.message || `status ${res.status}`}`);
  }

  const data = await res.json();
  const rowData = data.sheets?.[0]?.data?.[0]?.rowData || [];
  return rowData.map((r) => (r.values || []).map(cellToRich));
}