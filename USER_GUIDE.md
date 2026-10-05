# Legroom — User Guide

Legroom shows you exactly where your disk space went and helps you get it back
safely. Every figure is **space actually used on disk**, and the totals add up
to your drive's capacity — nothing is quietly left out.

This guide covers everything from installing Legroom to its advanced search
language. If you just want to free space quickly, read
[Quick start](#2-quick-start) and [Cleaning up safely](#8-cleaning-up-safely).

---

## Contents

1. [Installing](#1-installing)
2. [Quick start](#2-quick-start)
3. [The window at a glance](#3-the-window-at-a-glance)
4. [Scanning](#4-scanning)
5. [Overview](#5-overview)
6. [Storage Map](#6-storage-map)
7. [Largest Items, filters and search](#7-largest-items-filters-and-search)
8. [Cleaning up safely](#8-cleaning-up-safely)
9. [Applications](#9-applications)
10. [System Monitor](#10-system-monitor)
11. [Keyboard shortcuts](#11-keyboard-shortcuts)
12. [Search language reference](#12-search-language-reference)
13. [How Legroom counts space](#13-how-legroom-counts-space)
14. [Troubleshooting](#14-troubleshooting)
15. [Privacy and where Legroom keeps its data](#15-privacy-and-where-legroom-keeps-its-data)
16. [Command-line options](#16-command-line-options)
17. [Building from source](#17-building-from-source)

---

## 1. Installing

### Requirements

- Windows 10 or Windows 11, 64-bit.
- Microsoft Edge WebView2 — already part of Windows 11 and up-to-date
  Windows 10. If it is missing, the installer downloads it (this needs an
  internet connection the first time).

### Choosing an installer

| File | Use it when |
| --- | --- |
| `Legroom_<version>_x64-setup.exe` | Installing for yourself. No administrator permission needed; installs for your account only. **Recommended for most people.** |
| `Legroom_<version>_x64_en-US.msi` | Installing for every account on the PC, or deploying across many PCs (Group Policy, Intune). Needs administrator permission. |

Run the file and follow the steps. Legroom appears in the Start menu.

### "Windows protected your PC"

Until the installers are code-signed, Microsoft Defender SmartScreen shows this
warning for a new download. Click **More info**, then **Run anyway**.

### Updating and uninstalling

- **Update:** run the newer installer; it replaces the old version.
- **Uninstall:** Settings › Apps › Installed apps › Legroom › Uninstall.
  Before you uninstall, use **Put Everything Back** or **Remove
  Permanently** on anything Legroom set aside (see
  [section 8](#8-cleaning-up-safely)), so nothing is left in its holding
  folder.

---

## 2. Quick start

1. Open Legroom.
2. Click **Scan Whole Disk** (or **Scan Home Folder** for just your files).
3. When the scan finishes, the **Overview** opens. Look at
   **What could go** — each item says what deleting it would cost you
   (*Rebuilds itself*, *Re-downloadable*, …).
4. Tick the items you want gone. A bar appears at the bottom showing how much
   you have selected.
5. Click **Review…**, check the list, and click **Move to Recycle Bin**.
6. When you are sure, click **Remove Permanently…** in the yellow banner. This
   is the step that actually frees the space.

---

## 3. The window at a glance

```
┌──────────────────────────────────────────────────────────────────────┐
│ Legroom            [ Search files — try kind:video >1GB ]    ⟳  🎨   │  ← toolbar
├───────────────┬──────────────────────────────────────────────────────┤
│ Scan Whole    │                                                      │
│ Disk          │                                                      │
│ Home | Folder │                 the current view                     │
│ ☐ Fast scan   │                                                      │
│               │                                                      │
│ ( 92% ) disk  │                                                      │
│               │                                                      │
│ Views         │                                                      │
│  Overview     │                                                      │
│  Storage Map  │                                                      │
│  Largest Items│                                                      │
│  Applications │                                                      │
│  System Mon.  │                                                      │
│               ├──────────────────────────────────────────────────────┤
│ Filters / key │  3 items to clean up · 4.2 GB      Clear   Review…  │  ← cleanup bar
└───────────────┴──────────────────────────────────────────────────────┘
```

- **Toolbar** — search (available after a scan), **⟳** rescan the same
  folder, **🎨** map colours and light/dark appearance.
- **Sidebar** — what to scan, how full the drive is, the views, and — on the
  Storage Map and Largest Items — the filters and colour key.
- **Cleanup bar** — appears whenever something is ticked, in any view.

---

## 4. Scanning

### What to scan

| Button | Scans |
| --- | --- |
| **Scan Whole Disk** | The drive Legroom is looking at (usually `C:`). **Right-click** it to pick another drive. |
| **Home** | Your user folder, `C:\Users\<you>`. |
| **Folder…** | Any folder or drive you choose. |

You can also **drag a folder onto the window** to scan it, or click a drive
button on the welcome screen.

### Normal scan vs. Fast scan

| | Normal scan | Fast scan |
| --- | --- | --- |
| How it works | Lists folders one by one | Reads the drive's file table (the NTFS MFT) directly |
| Speed on a whole drive | Fast | Fastest — millions of files in seconds |
| Sees other accounts' and system folders | No — they are counted as *could not be read* | Yes, everything |
| Needs administrator permission | No | Yes, every time (Windows asks) |
| Works on | Any drive | NTFS drives with a drive letter |

Turn it on with **Fast scan (administrator)** in the sidebar. If a normal
scan reports folders it could not read, the Overview offers **Rescan with Fast
Scan**.

### While a scan runs

The screen shows how many items have been counted (or, for a fast scan, the
percentage of the file table read). Click **Stop** at any time. A stopped
normal scan keeps what it found so far and says the totals are partial; a
stopped fast scan returns to where you were.

---

## 5. Overview

The first view after a scan.

- **Size on disk, Files, Folders, Safe to reclaim** — the headline figures.
- **Folders that could not be read** — how many, and the button to rescan
  with Fast scan. Their contents are missing from the totals, and Legroom says
  so rather than hiding it.
- **Where the space went** — a bar that adds up to your drive's full capacity:
  - *Scanned* — what this scan measured.
  - *Elsewhere on the drive* — in use, but outside the folder you scanned.
    **Scan the whole disk** closes this gap.
  - *Not visible without administrator* — space a normal scan was refused.
  - *Windows* / *System* — space Windows reserves (page file, hibernation
    file, restore points, the file table itself). Real, but not yours to
    clean.
  - *Recycle Bin* — deleted, but not gone until emptied.
  - *Unaccounted* — anything that could not be attributed. It is labelled
    rather than folded into a neighbouring slice.
  - *Free*.
- **N GB of file size takes no room on this disk** — appears when files
  *claim* more than they occupy (online-only OneDrive files, compressed files,
  sparse virtual disks). See [section 13](#13-how-legroom-counts-space).
- **What it is made of** — the scan broken down by kind: videos, images,
  audio, documents, archives, developer files, apps, caches, AI models,
  Windows, other.
- **What could go** — cleanup suggestions, grouped by what removing them
  costs you:

| Label | Meaning |
| --- | --- |
| **Nothing owns this** | Left behind by something already removed. |
| **Rebuilds itself** | A cache; the program recreates it when needed. |
| **Rebuildable** | Build output; your tools regenerate it (e.g. `node_modules`, `target`). |
| **Re-downloadable** | Can be fetched again, at the cost of a download (e.g. AI models, SDKs). |
| **Not recoverable** | Your own data. Never suggested — shown for information. |

Each suggestion shows where it is, how long it has been untouched, and — where
a tool exists — the command that cleans it properly (for example
`npm cache clean --force`). **Select All** ticks every item in one group;
there is deliberately no "select everything" across groups.

Some items say *Windows reclaims this itself* or are greyed out: they are
outside your user folder, and Legroom only ever removes things inside it
(see [section 8](#8-cleaning-up-safely)).

**Right-click** any item for Add to Cleanup, Show in Explorer, Show in Storage
Map, Properties and Copy Path.

---

## 6. Storage Map

Every folder drawn as a rectangle whose **area is its size on disk**. Folders
are drawn with their contents nested inside, three levels deep.

### Getting around

- **Click a folder** to go into it.
- **Click a file** to select it; a bar at the bottom shows its details and an
  **Add to Cleanup** button.
- **Breadcrumbs** at the top take you back to any parent; **←** or
  **Alt+↑** goes up one level.
- **Hover** anything to see its name, size and share of the current folder
  at the top right.
- **Right-click** for Zoom In, Add to Cleanup, Open, Show in Explorer,
  Properties and Copy Path.

The striped tile labelled **"N smaller items"** stands for the many tiny files
and folders that would otherwise be unreadable slivers. Its size is exactly
the sum of what it represents.

Tiles with a blue outline are in your cleanup list. Hatched tiles marked
**Moved away** were moved to the Recycle Bin since the scan.

### Colours

Choose from the **🎨** button in the toolbar. The sidebar shows the key.

| Mode | Colours tiles by |
| --- | --- |
| **File kind** | What the files are: video, images, audio, documents, archives, developer, apps, caches, AI models, Windows, other. |
| **Reclaimability** | Which cleanup group (if any) a folder belongs to. Grey means not flagged. |
| **Last modified** | How recently anything inside changed — warm is this week, cold is years ago. |

A folder takes the colour of the kind that holds most of its bytes, when that
kind reaches 30%; otherwise it is "other".

### Filters on the map

Tick filters in the sidebar (next section). Everything they match keeps its
colour; everything else is dimmed, and a strip above the map says how much
the filters match in the current folder.

---

## 7. Largest Items, filters and search

### Largest Items

A list of the biggest **Files** or **Folders** (switch with the tabs). It
follows the Storage Map: if the map is inside a folder, the list shows that
folder's contents — click **Show everything** to widen it again.

- Click the column headings to sort by **Name**, **Modified** or **Size on
  disk**.
- **Double-click** a row to show it in the Storage Map.
- Tick the box on a row to add it to the cleanup list.
- When a file's claimed size is much larger than what it occupies, the claimed
  size is shown ~~struck through~~ under the real one.

### Filters

The sidebar on the Storage Map and Largest Items lists ready-made filters,
biggest first, each with how much it matches across the whole scan:

| Filter | Finds |
| --- | --- |
| Node.js | `node_modules`, npm/yarn/pnpm/bun caches, nvm |
| Visual Studio & .NET | `.vs`, NuGet packages and caches, debug symbols |
| Build Artifacts | `.next`, `__pycache__`, `.gradle`, `.svelte-kit` and similar |
| Android | Android SDK, emulators, Gradle |
| Docker & WSL | Docker data and WSL virtual disks |
| AI Models | Model files, Ollama, Hugging Face, LM Studio |
| Games | Steam, Epic, Xbox, GOG, EA and Riot game folders |
| Videos | All video files |
| Disk Images | `.iso`, `.vhdx`, `.vmdk` and other disk images |
| Archives & Installers | `.zip`, `.7z`, `.rar`, `.msi` and similar |
| Virtual Machines | Hyper-V, VirtualBox, VMware and Android emulator machines |
| iPhone Backups | iTunes / Apple Devices backups |
| Large Media | Videos, audio and images over 100 MB |
| Temp, Logs & Caches | Temp folders, crash dumps, browser and GPU caches, logs |
| Old Downloads | Things in Downloads untouched for six months |

Tick several to combine them. With filters on, **Largest Items** becomes
**Filter Matches**. Hover a filter to see the exact search behind it.

### Search

Click the search box (or press **Ctrl+F**) after a scan and type. Results
appear as you type, over whatever view is open.

- Plain words search names: `invoice`.
- Add filters for power: `kind:video >1GB`, `ext:iso in:Downloads`,
  `older:1y -in:AppData`.
- The **Everywhere / This folder** button limits results to the folder the
  map is showing.
- Sort results by **Size**, **Name** or **Modified**.
- **Double-click** a result to show it in the Storage Map; tick it to add it
  to the cleanup list; right-click for more.

The full syntax is in [section 12](#12-search-language-reference). A query
Legroom does not understand shows clickable examples.

---

## 8. Cleaning up safely

Removing anything is a deliberate, two-stage process, and nothing is deleted
until the second stage.

### Stage 1 — Review and move

1. Tick items anywhere: Overview suggestions, list rows, search results, map
   tiles. They all collect in the **cleanup bar** at the bottom. Click the bar
   to see or remove individual items. Its total never counts the same bytes
   twice (a folder and a file inside it count once).
2. Click **Review…**. Legroom re-measures everything and shows:
   - **Will move** — each item, its size, and where it goes: the **Recycle
     Bin**, or Legroom's **holding folder** when an item is too big for the
     Recycle Bin.
   - **Left alone** — anything refused, with the reason.
3. Click **Move to Recycle Bin**.

Nothing is deleted yet. A banner offers **Put Everything Back** at any time;
items in the Recycle Bin can also be restored from Explorer.

### Stage 2 — Remove permanently

Moving to the Recycle Bin **does not free space** — on the same drive it is
only a rename. The yellow banner on the Overview ("*N GB is in the Recycle
Bin*") and the sidebar's **set aside** line remind you of this.

Click **Remove Permanently…** and confirm. Only the items **Legroom moved**
are removed — anything else you put in the Recycle Bin yourself is left alone.
This step cannot be undone.

### What Legroom will never remove

Legroom only ever removes things **inside your user folder**
(`C:\Users\<you>`). Within it, it still refuses:

- Your user folder itself, and its top-level folders as a whole (Desktop,
  Documents, Downloads, Pictures, Music, Videos, AppData, OneDrive, …) —
  things *inside* them are fine.
- `AppData\Local`, `AppData\Roaming`, `AppData\LocalLow` and
  `AppData\Local\Temp` themselves.
- Anything in **OneDrive** — deleting it there deletes it everywhere it syncs.
- Keys and credentials: `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`,
  `.docker`, saved Windows credentials, certificates and their private keys.
- iPhone/iPad backups, Thunderbird mail, Outlook mailboxes (`.pst`, `.ost`),
  password databases (`.kdbx`), private-key files (`.pfx`, `.p12`, `.ppk`).
- Your Windows profile files (`NTUSER.DAT` and friends).
- Links and junctions (removing one frees nothing), files marked as system or
  read-only, and anything that changed or disappeared since the scan.

The refusal reason appears in the Review sheet.

---

## 9. Applications

Every app installed on the PC — desktop programs and Microsoft Store apps —
with its real size, and a way to remove it. This view does not need a scan.

### The list

- **Filter** by name or publisher; show **All**, **Desktop** or **Store**
  apps; sort by **Size**, **Name** or **Installed** date.
- Badges: **Store** (from the Microsoft Store) and **All users** (installed
  for every account).
- **Size** is measured, not taken on trust:
  - From the current scan, when it covered the app's folder.
  - Otherwise Legroom measures the folder itself the first time (a spinner
    shows while it does).
  - **≈ size** — the installer's own estimate, used only when the folder
    could not be measured.
  - **unknown** — the installer did not record where the app lives.
  - Store apps also show their **data** folder size.

The total at the top counts each folder once, and lists installer estimates
separately.

### Uninstalling

Click **Uninstall** and confirm.

- **Desktop programs** — the program's **own uninstaller** opens. Follow its
  steps; Windows asks for administrator permission when it needs it. When it
  closes, the app disappears from the list. If it is still listed, the
  uninstaller was cancelled — or is still open in another window.
- **Store apps** — Windows removes the app and **its data** for your account.
  This cannot be undone.

Right-click an app for **Show in Explorer**, **Show Data Folder**, **Show in
Storage Map**, **Copy Name** and **Open Windows Apps Settings**.

### Left behind by apps you removed

After a scan, folders that no installed app owns any more appear at the bottom
of this view. Tick them to add them to the cleanup list; they go through the
same review as everything else.

---

## 10. System Monitor

What the PC is doing right now, updated every second while this view is open
(and not at all when it isn't). Figures come from the same Windows
performance counters Task Manager uses, so they match it.

| Card | Shows |
| --- | --- |
| **Processor** | Total load, the last minute as a graph, current and base speed, number of logical processors, and a bar per processor. |
| **Memory** | In use / total, graph, a bar of in use · cached · free, available, cached, committed (against RAM plus page file), page file use. |
| **Disk** (one per physical disk) | Active time, graph, read and write speed, and each drive letter's free space. |
| **Network** (one per adapter) | Combined throughput, graph, received and sent, link speed. |
| **GPU** (one per graphics card) | Busiest engine, graph, load per engine (3D, Copy, Video decode, …), dedicated and shared video memory. |

The header shows up time and how many processes, threads and handles are
running. **Pause** freezes the figures.

### Processes

- Sort by **Name**, **PID**, **CPU**, **Memory** or **Disk**; filter by name
  or PID. Busy processes are highlighted in the CPU column.
- **End task** (hover a row, or right-click) ends a process immediately —
  unsaved work in it is lost, so Legroom asks first.
- Processes with a **shield** are part of Windows (for example `csrss.exe`,
  `lsass.exe`); ending them would crash Windows, so it is not offered.
- Rows showing **—** belong to Windows or another account. Run Legroom as
  administrator to see their details.
- Right-click for **Open File Location**, **Properties**, **Copy Name** and
  **Copy Path**.

---

## 11. Keyboard shortcuts

| Keys | Action |
| --- | --- |
| **Ctrl+F** | Search |
| **Ctrl+R** or **F5** | Scan the same folder again |
| **Ctrl+1** … **Ctrl+5** | Overview, Storage Map, Largest Items, Applications, System Monitor |
| **Alt+↑** | Storage Map: up one level |
| **Enter** (in search) | Search now |
| **Esc** | Close the Review sheet, or close search |

---

## 12. Search language reference

Terms written next to each other must **all** match. `|` (or the word `OR`)
separates alternatives. A leading `-` negates a term. Put names with spaces
in quotes: `name:"Epic Games"`.

| Term | Matches | Example |
| --- | --- | --- |
| *word* | Names containing the word | `invoice` |
| `*` and `?` | Name patterns | `*.mov`, `IMG_????.jpg` |
| `name:` | Exact names (comma list) | `name:node_modules,.venv` |
| `ext:` | File extensions (comma list) | `ext:iso,vhdx` · `ext:tar.gz` |
| `kind:` | Kinds (comma list) | `kind:video,audio` |
| `is:` | `file`, `folder`, `empty` | `is:folder is:empty` |
| `size:` | Size on disk: `>` `>=` `<` `<=`, or a range `low..high` | `size:>500MB`, `size:1GB..5GB` |
| `>`… / `<`… | Short for `size:` | `>1GB` |
| `older:` | Nothing inside changed for at least… | `older:1y` |
| `newer:` | Something inside changed within… | `newer:2w` |
| `before:` | Last changed before a date | `before:2024-06` |
| `after:` | Changed on or after a date | `after:2025` |
| `in:` | Somewhere under a folder **with that name** | `in:Downloads` |
| `under:` | Under an **exact path** (`~` is your user folder) | `under:~/AppData/Local/Temp` |

- **Kinds:** `video`, `image`, `audio`, `document`, `archive`, `developer`,
  `app`, `cache`, `model`, `system`, `other` (plus `folder` / `file`).
- **Sizes:** `B`, `KB`, `MB`, `GB`, `TB` — decimals allowed: `1.5GB`.
- **Ages:** `h`, `d`, `w`, `mo`, `y` — e.g. `90d`, `6mo`, `2y`.
- **Dates:** `2024`, `2024-06` or `2024-06-30`.

**Examples**

```text
kind:video >1GB                       large videos
ext:iso,vhdx in:Downloads             disk images in any Downloads folder
older:1y -in:AppData                  untouched for a year, outside AppData
node_modules | .venv                  either one
is:folder is:empty                    empty folders
kind:image after:2025 size:>20MB      big photos from this year
under:~/Videos -kind:video            non-video files in your Videos folder
```

Search totals never count the same bytes twice: when a folder and something
inside it both match, only the folder's bytes are added up.

---

## 13. How Legroom counts space

Legroom's promise is that **every number reconciles**. A few rules make that
true — and explain why its figures can differ from other tools:

- **Size on disk, not file size.** Legroom counts the space a file actually
  occupies. A 64 GB virtual disk that only uses 12 GB counts as 12 GB, because
  deleting it frees 12 GB. Where the two differ a lot, the claimed size is
  shown struck through.
- **Hard links are counted once.** Several names for the same file do not
  multiply its size.
- **Online-only cloud files** (OneDrive "Files On-Demand") take almost no room
  locally and are counted that way.
- **Nothing is counted twice.** Every total — search, filters, the cleanup
  bar, apps — adds up only outermost items.
- **Links are measured, never followed**, and a scan never crosses into
  another drive mounted inside a folder.
- **What could not be read is reported**, not silently skipped.
- **Units match Explorer** (1 KB = 1,024 bytes), so figures line up with what
  Explorer and Properties show.

---

## 14. Troubleshooting

**"N folders could not be read".**
A normal scan cannot open other accounts' folders or some that Windows keeps
for itself. Use **Rescan with Fast Scan** to include them.

**Fast scan says it needs administrator permission, or fails.**
Approve the Windows prompt. Fast scan only works on NTFS drives with a drive
letter; for USB sticks, network drives and other file systems, use a normal
scan.

**The totals don't match Explorer's "Size".**
Explorer's *Size* is what files claim; Legroom shows *Size on disk* — compare
with **Size on disk** in Explorer's Properties instead. See
[section 13](#13-how-legroom-counts-space).

**I moved things to the Recycle Bin but have no more free space.**
That is expected — moving to the Recycle Bin frees nothing. Click **Remove
Permanently…** in the yellow banner.

**An item was "left alone" in the Review.**
The reason is shown beside it. Legroom only removes items inside your user
folder and never touches protected locations
([section 8](#8-cleaning-up-safely)).

**An app's size says "unknown" or "≈".**
"Unknown" means the installer never recorded the app's folder. "≈" is the
installer's estimate because the folder could not be measured. Scanning the
drive often fills these in.

**An uninstall did nothing.**
Some uninstallers open a second window and close the first; finish the steps
there, then click **Refresh** (⟳) in Applications. If Windows asked for
administrator permission and it was declined, nothing was removed.

**"End task" is missing for a process.**
It is part of Windows (shield icon) or belongs to another account (—).

**Windows says "Windows protected your PC" when installing.**
Click **More info → Run anyway**. See [section 1](#1-installing).

---

## 15. Privacy and where Legroom keeps its data

- Legroom works entirely on your PC. It does not upload your file lists or
  anything else.
- It never changes or deletes anything without the review in
  [section 8](#8-cleaning-up-safely), and never outside your user folder.
- Its own data lives in `%LOCALAPPDATA%\DiskMap`:
  - the record of what it moved (so **Put Everything Back** and **Remove
    Permanently** work across restarts);
  - `Holding\` — items that were too big for the Recycle Bin.
- Window preferences (map colours, light/dark, fast-scan setting) are kept by
  the app's window.

---

## 16. Command-line options

Legroom can be started with switches — useful for shortcuts and scripts:

| Switch | Effect |
| --- | --- |
| `--scan <path>` | Start scanning that folder or drive at launch. |
| `--fast` | Make that scan a fast scan. |
| `--pane <name>` | Open a view: `overview`, `treemap` (or `map`), `files`, `apps`, `monitor`. |
| `--shots <folder>` | Save a screenshot of every view to the folder, then quit. |
| `--verbose` | Print progress notes to the console. |

Example:

```text
Legroom.exe --scan C:\ --pane treemap
```

---

## 17. Building from source

For developers. You need **Rust** (via rustup), **Node.js 20+**, and the
**Visual Studio C++ Build Tools**.

```text
cd app
npm install
npm run tauri dev        # run the app in development
npm run tauri build      # build the .exe and .msi installers
```

The installers are written to `target\release\bundle\nsis\` and
`target\release\bundle\msi\`. Before releasing an update, raise `version` in
`app/src-tauri/tauri.conf.json` — an installer only upgrades an existing copy
when its version is higher.

Measuring scan speed (run from an administrator terminal for `--mft`):

```text
cargo run --release -p diskmap-bench -- C:\ --mft
```

| Environment variable | Effect |
| --- | --- |
| `DISKMAP_TRACE=1` | Print the fast scan's timing per phase. |
| `DISKMAP_MFT_READERS=<n>` | Parallel reads during a fast scan (default 4). |
| `DISKMAP_MFT_BUFFERED=1` | Read the file table through the Windows cache, for comparison. |
| `DISKMAP_THREADS=<n>` | Threads for a normal scan. |

The accounting rules every figure follows are in
[`docs/ACCOUNTING.md`](ACCOUNTING.md).
