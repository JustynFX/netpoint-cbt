/**
 * NetPoint CBT & Cyber Café — Google Apps Script Webhook
 *
 * Setup steps for Mr. Edosa Ekhator:
 * 1. Create a Google Sheet with Row 1 headers exactly:
 *    Timestamp | Name | Email | Phone | Service | Message | Label
 * 2. Open Extensions -> Apps Script, paste this entire file, and save.
 * 3. Click Deploy -> New deployment -> Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into GOOGLE_SHEET_WEBHOOK_URL in .env.local
 * 5. Also publish the sheet as CSV (File -> Share -> Publish to web -> Sheet1 -> CSV)
 *    and paste that URL into NEXT_PUBLIC_SHEET_CSV_URL for the /admin dashboard.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.Timestamp || new Date().toISOString(),
      data.Name || "",
      data.Email || "",
      data.Phone || "N/A",
      data.Service || "",
      data.Message || "",
      data.Label || "WARM",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
