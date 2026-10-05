// Where the installers are downloaded from.
//
// Paste each installer's Google Drive share link below — the link from
// Share › "Anyone with the link" › Copy link, which looks like
//   https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing
// The site turns it into a direct download on its own. Until a link is set,
// its button says the download is coming soon instead of pointing nowhere.
//
// Update `version` and the sizes whenever you upload a new build.
window.LEGROOM_DOWNLOADS = {
  version: "0.1.0",
  channel: "beta",
  released: "2026-10-05",
  exe: {
    url: "", // ← Google Drive link for Legroom_0.1.0_x64-setup.exe
    file: "Legroom_0.1.0_x64-setup.exe",
    size: "2.4 MB",
  },
  msi: {
    url: "", // ← Google Drive link for Legroom_0.1.0_x64_en-US.msi
    file: "Legroom_0.1.0_x64_en-US.msi",
    size: "3.6 MB",
  },
};
