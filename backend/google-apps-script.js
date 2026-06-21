// ============================================================
// GOOGLE APPS SCRIPT - TransElite Auth + Data Backend
// ============================================================
// CARA DEPLOY:
// 1. Buka Google Spreadsheet Anda
// 2. Extensions > Apps Script
// 3. Hapus semua kode lama, paste kode ini
// 4. Klik "Run" > pilih fungsi "testAuth" > Authorize semua permission
// 5. Deploy > New deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy URL deployment, update di backend/.env (GOOGLE_SCRIPT_URL)
// ============================================================

function testAuth() {
  DriveApp.getRootFolder();
  SpreadsheetApp.getActiveSpreadsheet();
  MailApp.getRemainingDailyQuota();
  Logger.log("Authorization Successful. Quota: " + MailApp.getRemainingDailyQuota());
}

// =========================
// doGet — Read sheet data
// =========================
function doGet(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = e.parameter.sheet;

  if (!sheetName) {
    var sheets = spreadsheet.getSheets().map(function (s) { return s.getName(); });
    return ContentService.createTextOutput(JSON.stringify({ sheets: sheets }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found: " + sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i].every(function (cell) { return cell === "" || cell === null; })) continue;
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j] !== "") {
        row[headers[j]] = data[i][j];
      }
    }
    rows.push(row);
  }

  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================
// doPost — Auth actions
// =========================
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  if (!e) {
    return output.setContent(JSON.stringify({ status: 'error', error: 'Do not run directly.' }));
  }

  try {
    var data = {};
    var action = '';

    // Parse JSON body
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
        action = data.action;
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    if (!action && data && data.action) action = data.action;
    if (!action && e.parameter && e.parameter.action) action = e.parameter.action;

    if (!action) {
      return output.setContent(JSON.stringify({ status: 'error', error: "No 'action' specified" }));
    }

    // Route
    if (action === 'register') return handleRegister(data, output);
    if (action === 'login') return handleLogin(data, output);
    if (action === 'verify_email') return handleVerifyEmail(data, output);
    if (action === 'forgot_password') return handleForgotPassword(data, output);
    if (action === 'reset_password') return handleResetPassword(data, output);
    if (action === 'add_gallery') return handleAddGallery(data, output);
    if (action === 'update_gallery') return handleUpdateGallery(data, output);
    if (action === 'delete_gallery') return handleDeleteGallery(data, output);

    return output.setContent(JSON.stringify({ status: 'error', error: 'Invalid action: ' + action }));
  } catch (error) {
    return output.setContent(JSON.stringify({ status: 'error', error: error.toString() }));
  }
}

// =========================
// REGISTER
// =========================
function handleRegister(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) {
    sheet = ss.insertSheet("Users");
    sheet.appendRow(["timestamp", "name", "email", "password", "resetToken"]);
  }

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][2] && values[i][2].toString().toLowerCase() === data.email.toLowerCase()) {
      return output.setContent(JSON.stringify({ status: 'error', error: 'Email sudah terdaftar' }));
    }
  }

  var token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sheet.appendRow([new Date(), data.name, data.email, data.password, token, "FALSE"]);

  // Send verification email
  var verifyBase = data.verifyLinkBase;
  if (verifyBase) {
    var fullLink = verifyBase + "?email=" + encodeURIComponent(data.email) + "&token=" + token;
    try {
      MailApp.sendEmail({
        to: data.email,
        noReply: true,
        name: "TransElite",
        subject: "Activate Your TransElite Account",
        body: "Hello " + data.name + ",\n\nThank you for registering with TransElite Premium Transport.\n\nPlease verify your email by clicking the link below:\n" + fullLink + "\n\nIf you did not create this account, you can safely ignore this email.\n\nBest regards,\nTransElite Team",
        htmlBody: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
          '<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;"><tr><td align="center">' +
          '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">' +
          '<tr><td style="background-color:#0B0F19;color:white;padding:24px;text-align:center;">' +
          '<h1 style="margin:0;font-size:26px;letter-spacing:2px;font-style:italic;">TRANS<span style="color:#f59e0b;">ELITE</span></h1>' +
          '<p style="margin:5px 0 0;font-size:11px;letter-spacing:3px;color:#94a3b8;">PREMIUM TRANSPORT</p></td></tr>' +
          '<tr><td style="padding:30px 40px;color:#333333;">' +
          '<p style="font-size:16px;margin-top:0;">Hello ' + data.name + ',</p>' +
          '<p style="font-size:14px;line-height:1.6;color:#555;">Thank you for registering with <strong>TransElite</strong>. To complete your registration, please verify your email address.</p>' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:25px 0;">' +
          '<a href="' + fullLink + '" style="background-color:#f59e0b;color:#0B0F19;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;display:inline-block;">Verify Email Address</a>' +
          '</td></tr></table>' +
          '<p style="font-size:12px;color:#999;line-height:1.5;">If you did not create this account, no action is needed. This link will expire automatically.</p>' +
          '</td></tr>' +
          '<tr><td style="background-color:#f1f5f9;color:#64748B;padding:16px;text-align:center;font-size:11px;">' +
          '<p style="margin:0;">TransElite Premium Transport</p>' +
          '<p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">This is an automated message. Please do not reply.</p></td></tr>' +
          '</table></td></tr></table></body></html>'
      });
    } catch (mailErr) {
      // Registration still succeeds even if email fails
      Logger.log("Mail error: " + mailErr.toString());
    }
  }

  return output.setContent(JSON.stringify({ status: 'success', message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.' }));
}

// =========================
// LOGIN
// =========================
function handleLogin(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Database user kosong' }));

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][2] && values[i][2].toString().toLowerCase() === data.email.toLowerCase() &&
      values[i][3] && values[i][3].toString() === data.password) {

      var isVerifiedVal = values[i][5] ? values[i][5].toString().toUpperCase() : "";
      var tokenVal = values[i][4];

      if (isVerifiedVal === "FALSE") {
        return output.setContent(JSON.stringify({ status: 'error', error: 'Akun belum diverifikasi. Silakan cek email Anda.' }));
      }
      if (!isVerifiedVal && tokenVal && tokenVal.toString().trim() !== "") {
        return output.setContent(JSON.stringify({ status: 'error', error: 'Akun belum diverifikasi. Silakan cek email Anda.' }));
      }

      return output.setContent(JSON.stringify({
        status: 'success',
        user: { name: values[i][1], email: values[i][2] }
      }));
    }
  }

  return output.setContent(JSON.stringify({ status: 'error', error: 'Email atau password salah' }));
}

// =========================
// VERIFY EMAIL
// =========================
function handleVerifyEmail(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Database user tidak ditemukan' }));

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    var rowEmail = values[i][2] ? values[i][2].toString().toLowerCase() : "";
    var rowToken = values[i][4] ? values[i][4].toString().trim() : "";
    var isVerifiedVal = values[i][5] ? values[i][5].toString().toUpperCase() : "FALSE";

    if (rowEmail === data.email.toLowerCase()) {
      if (isVerifiedVal === "TRUE") {
        return output.setContent(JSON.stringify({ status: 'success', message: 'Email sudah terverifikasi' }));
      }
      if (rowToken === data.token.trim()) {
        sheet.getRange(i + 1, 6).setValue("TRUE");
        return output.setContent(JSON.stringify({ status: 'success', message: 'Email berhasil diverifikasi!' }));
      } else {
        return output.setContent(JSON.stringify({ status: 'error', error: 'Token verifikasi tidak valid' }));
      }
    }
  }

  return output.setContent(JSON.stringify({ status: 'error', error: 'User tidak ditemukan' }));
}

// =========================
// FORGOT PASSWORD
// =========================
function handleForgotPassword(data, output) {
  var email = data.email;
  var resetBase = data.resetLinkBase;

  if (!email || !resetBase) {
    return output.setContent(JSON.stringify({ status: 'error', error: 'Email atau link base tidak lengkap' }));
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Email tidak terdaftar' }));

  var values = sheet.getDataRange().getValues();
  var userRowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][2] && values[i][2].toString().toLowerCase() === email.toLowerCase()) {
      userRowIndex = i;
      break;
    }
  }

  if (userRowIndex === -1) {
    return output.setContent(JSON.stringify({ status: 'error', error: 'Email tidak terdaftar' }));
  }

  var token = Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Save reset token (Column E = Index 5 in 1-based)
  sheet.getRange(userRowIndex + 1, 5).setValue(token);

  var fullLink = resetBase + "?email=" + encodeURIComponent(email) + "&token=" + token;

  try {
    MailApp.sendEmail({
      to: email,
      noReply: true,
      name: "TransElite",
      subject: "Reset Your TransElite Password",
      body: "Hello,\n\nWe received a request to reset your TransElite account password.\n\nClick the link below to set a new password:\n" + fullLink + "\n\nIf you did not request this, you can safely ignore this email. Your password will not be changed.\n\nBest regards,\nTransElite Team",
      htmlBody: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
        '<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;"><tr><td align="center">' +
        '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">' +
        '<tr><td style="background-color:#0B0F19;color:white;padding:24px;text-align:center;">' +
        '<h1 style="margin:0;font-size:26px;letter-spacing:2px;font-style:italic;">TRANS<span style="color:#f59e0b;">ELITE</span></h1>' +
        '<p style="margin:5px 0 0;font-size:11px;letter-spacing:3px;color:#94a3b8;">PREMIUM TRANSPORT</p></td></tr>' +
        '<tr><td style="padding:30px 40px;color:#333333;">' +
        '<p style="font-size:16px;margin-top:0;">Hello,</p>' +
        '<p style="font-size:14px;line-height:1.6;color:#555;">We received a request to reset the password for your <strong>TransElite</strong> account.</p>' +
        '<p style="font-size:14px;line-height:1.6;color:#555;">Click the button below to set a new password:</p>' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:25px 0;">' +
        '<a href="' + fullLink + '" style="background-color:#f59e0b;color:#0B0F19;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;display:inline-block;">Reset Password</a>' +
        '</td></tr></table>' +
        '<p style="font-size:12px;color:#999;line-height:1.5;">If you did not request a password reset, no action is needed. Your password will remain unchanged.</p>' +
        '</td></tr>' +
        '<tr><td style="background-color:#f1f5f9;color:#64748B;padding:16px;text-align:center;font-size:11px;">' +
        '<p style="margin:0;">TransElite Premium Transport</p>' +
        '<p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">This is an automated message. Please do not reply.</p></td></tr>' +
        '</table></td></tr></table></body></html>'
    });
    return output.setContent(JSON.stringify({ status: 'success', message: 'Password reset link has been sent to ' + email }));
  } catch (mailErr) {
    return output.setContent(JSON.stringify({ status: 'error', error: 'Gagal mengirim email: ' + mailErr.toString() }));
  }
}

// =========================
// RESET PASSWORD
// =========================
function handleResetPassword(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Database user tidak ditemukan' }));

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][2] && values[i][2].toString().toLowerCase() === data.email.toLowerCase()) {
      // Verify reset token (Column E = Index 4)
      var storedToken = values[i][4] ? values[i][4].toString().trim() : "";
      if (data.token && storedToken && storedToken === data.token.trim()) {
        // Update password (Column D = col 4 in 1-based)
        sheet.getRange(i + 1, 4).setValue(data.newPassword);
        // Clear reset token
        sheet.getRange(i + 1, 5).setValue("");
        return output.setContent(JSON.stringify({ status: 'success', message: 'Password berhasil direset' }));
      } else {
        return output.setContent(JSON.stringify({ status: 'error', error: 'Token reset tidak valid atau sudah kadaluarsa' }));
      }
    }
  }

  return output.setContent(JSON.stringify({ status: 'error', error: 'User tidak ditemukan' }));
}

// =========================
// GALLERY FOLDER HELPER
// =========================
function getGalleryFolder() {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty('GALLERY_FOLDER_ID');

  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (e) {
      // If folder deleted, continue to recreate
    }
  }

  var folders = DriveApp.getFoldersByName("TransGo_Gallery");
  var targetFolder;
  if (folders.hasNext()) {
    targetFolder = folders.next();
  } else {
    targetFolder = DriveApp.createFolder("TransGo_Gallery");
    targetFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  props.setProperty('GALLERY_FOLDER_ID', targetFolder.getId());
  return targetFolder;
}

// =========================
// ADD GALLERY
// =========================
function handleAddGallery(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Gallery");
  if (!sheet) {
    sheet = ss.insertSheet("Gallery");
    // Create KV metadata section at top
    sheet.appendRow(["gallery_badge", "Memories"]);
    sheet.appendRow(["gallery_title", "Our"]);
    sheet.appendRow(["gallery_highlight", "Gallery"]);
    sheet.appendRow(["gallery_desc", "Moment perjalanan luar biasa bersama para pelanggan kami."]);
    sheet.appendRow(["gallery_empty", "Belum ada foto galeri."]);
    sheet.appendRow(["gallery_modal_add", "Add New Photo"]);
    sheet.appendRow(["gallery_modal_edit", "Edit Photo"]);
    sheet.appendRow(["gallery_modal_cancel", "Cancel"]);
    sheet.appendRow(["gallery_modal_save", "Save Changes"]);
    sheet.appendRow(["gallery_modal_add_btn", "Upload Photo"]);
    sheet.appendRow([""]); // Blank separator (row 11)
    sheet.appendRow(["id", "fleet name", "judul", "tanggal", "image", "description"]); // Table header (row 12)
  }

  // Handle Image Upload to Drive
  var imgUrl = "";
  if (data.fileBase64) {
    try {
      var blob = Utilities.newBlob(Utilities.base64Decode(data.fileBase64), data.mimeType || 'image/jpeg', data.fileName || 'gallery_img.jpg');

      var targetFolder = getGalleryFolder();

      var file = targetFolder.createFile(blob);
      var fileId = file.getId();
      // Pastikan file permission-nya public bisa dilihat
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imgUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    } catch (e) {
      return output.setContent(JSON.stringify({ status: 'error', error: 'Gagal mengupload gambar ke Drive: ' + e.toString() }));
    }
  } else {
    return output.setContent(JSON.stringify({ status: 'error', error: 'Gambar tidak ditemukan.' }));
  }

  // Calculate Next ID — scan only data rows (row 13+)
  var values = sheet.getDataRange().getValues();
  var nextId = 1;
  // Find where the table header row is (contains "id" in first column)
  var tableHeaderRow = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().toLowerCase() === 'id') {
      tableHeaderRow = i;
      break;
    }
  }
  if (tableHeaderRow >= 0) {
    for (var i = tableHeaderRow + 1; i < values.length; i++) {
      var parsedId = parseInt(values[i][0]);
      if (!isNaN(parsedId) && parsedId >= nextId) {
        nextId = parsedId + 1;
      }
    }
  }

  // Append row at the bottom
  sheet.appendRow([
    nextId,
    data.fleetName || "",
    data.judul || "",
    data.tanggal || "",
    imgUrl,
    data.description || ""
  ]);

  return output.setContent(JSON.stringify({ status: 'success', message: 'Fleet image berhasil ditambahkan ke gallery.' }));
}

// =========================
// UPDATE GALLERY
// =========================
function handleUpdateGallery(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Gallery");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Gallery sheet tidak ditemukan' }));

  if (!data.id) return output.setContent(JSON.stringify({ status: 'error', error: 'ID gallery tidak ditemukan' }));

  var values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  // Find the matching data row (skip KV metadata rows by looking for numeric ID)
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString() === data.id.toString()) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) return output.setContent(JSON.stringify({ status: 'error', error: 'Data gallery tidak ditemukan' }));

  var targetRow = rowIndex + 1; // 1-based index for getRange

  // Update image if unedited or uploaded
  var imgUrl = values[rowIndex][4]; // keep existing image (Index 4 is 'image' column)
  if (data.fileBase64) {
    try {
      var blob = Utilities.newBlob(Utilities.base64Decode(data.fileBase64), data.mimeType || 'image/jpeg', data.fileName || 'gallery_img.jpg');

      var targetFolder = getGalleryFolder();

      var file = targetFolder.createFile(blob);
      var fileId = file.getId();
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imgUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    } catch (e) {
      return output.setContent(JSON.stringify({ status: 'error', error: 'Gagal mengupload gambar ke Drive: ' + e.toString() }));
    }
  }

  // ["id", "fleet name", "judul", "tanggal", "image", "description"]
  // col 1: id (no change)
  if (data.fleetName !== undefined) sheet.getRange(targetRow, 2).setValue(data.fleetName);
  if (data.judul !== undefined) sheet.getRange(targetRow, 3).setValue(data.judul);
  if (data.tanggal !== undefined) sheet.getRange(targetRow, 4).setValue(data.tanggal);
  sheet.getRange(targetRow, 5).setValue(imgUrl);
  if (data.description !== undefined) sheet.getRange(targetRow, 6).setValue(data.description);

  return output.setContent(JSON.stringify({ status: 'success', message: 'Gallery berhasil diupdate.' }));
}

// =========================
// DELETE GALLERY
// =========================
function handleDeleteGallery(data, output) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Gallery");
  if (!sheet) return output.setContent(JSON.stringify({ status: 'error', error: 'Gallery sheet tidak ditemukan' }));

  if (!data.id) return output.setContent(JSON.stringify({ status: 'error', error: 'ID gallery tidak ditemukan' }));

  var values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString() === data.id.toString()) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) return output.setContent(JSON.stringify({ status: 'error', error: 'Data gallery tidak ditemukan' }));

  sheet.deleteRow(rowIndex + 1); // 1-based index

  return output.setContent(JSON.stringify({ status: 'success', message: 'Gallery berhasil dihapus.' }));
}
