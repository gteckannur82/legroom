// Where the installers are downloaded from.
//
// The installers are attached to GitHub Releases under fixed names, and
// `releases/latest/download/<name>` always serves the newest release — so
// publishing a new release needs no change here beyond `version`, `released`
// and the sizes. (Mark releases as regular, not pre-release: "latest" skips
// pre-releases.)
//
// Any direct link works in `url`. A Google Drive share link is also accepted
// and turned into a direct download. Until a link is set, its button says the
// download is coming soon instead of pointing nowhere.
window.LEGROOM_DOWNLOADS = {
  version: "0.1.0",
  channel: "beta",
  released: "2026-10-05",
  exe: {
    url: "https://github.com/gteckannur82/win_cleaner/releases/latest/download/Legroom_x64-setup.exe",
    file: "Legroom_x64-setup.exe",
    size: "2.4 MB",
  },
  msi: {
    url: "https://github.com/gteckannur82/win_cleaner/releases/latest/download/Legroom_x64_en-US.msi",
    file: "Legroom_x64_en-US.msi",
    size: "3.6 MB",
  },
};
