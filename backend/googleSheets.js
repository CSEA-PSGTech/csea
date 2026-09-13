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
