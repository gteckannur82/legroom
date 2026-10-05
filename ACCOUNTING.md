# Accounting rules

The product thesis is that every number reconciles. This file is the contract
for how bytes are counted; anything that would trade accuracy for a friendlier
figure gets settled here rather than in a view.

## 1. Physical, never logical

Sizes are **allocated bytes** — `st_blocks * 512` — not `st_size`.

`st_size` is what the file claims. `st_blocks` is what the disk gave it. For
ordinary files they agree. For sparse files they do not, and the gap is not
small: the bridge smoke test creates one 512 MB sparse file and measures
**344 KB** of real allocation, a factor of 1,562.

This is the single most common error in this category of app, and `Docker.raw`
is where users meet it — a disk image that reports 64 GB and occupies a
fraction of that. Deleting it frees the allocated size, not the apparent one.

Both numbers are carried on every node (`physical`, `logical`) and the UI shows
the apparent figure struck through wherever they diverge, so the discrepancy is
explained rather than hidden.

## 2. Hardlinks are charged once

A file with `st_nlink > 1` occupies its blocks once, however many names point at
it. The scanner keeps a set of inodes and charges the first name it meets; later
links get `physical = 0` and the `HARDLINK_DUP` flag, keeping `logical` for
display. The inode alone is enough as a key because rule 4 means a scan never
leaves one device.

The de-duplication runs on the assembler thread, not in the readers, so the
result does not depend on how the parallel reads happen to interleave — the
same tree always produces the same answer.

Without this, a Time Machine local backup or a `node_modules` tree full of
linked binaries inflates the total well past the size of the disk.

## 3. APFS clones cannot be resolved — say so

A clone shares blocks with its source but has a **distinct inode**, so the
`(dev, ino)` trick does not catch it, and no public API reports which blocks are
shared. `st_blocks` attributes the full extent to each clone independently.

There is no fix available to us. The rule is therefore: **do not claim
precision we do not have.** Where cloning is likely, the UI says the figure is
an upper bound rather than quietly presenting a number that will not match what
gets freed.

## 4. Mount points are not crossed

The scan stays on the device it started on. Entries whose `st_dev` differs are
recorded with the `MOUNT_POINT` flag and not descended into.

On modern macOS the system and data volumes are stitched together with
firmlinks, so a naive walk from `/` counts `/System/Volumes/Data` twice and
reports more bytes than the disk holds. Staying on one device is what prevents
that.

## 5. A directory's own size is its blocks, not its `st_size`

A directory contributes **its allocated blocks** to `physical` and **nothing**
to `logical`. Its contents arrive through the rollup.

`st_size` on a directory is a metadata artefact — on APFS it is a small
synthetic number related to entry count, not storage anyone can see or delete.
Counting it as apparent size inflates the total by something with no meaning.
Its allocated blocks are real, though: APFS stores small directories inline
(0 blocks) but a large one allocates actual space, so dropping that would
under-count every big directory on the disk.

Both readers must apply this identically. The `bulk_and_fallback_agree` test
exists because they did not: the bulk path was dropping directory allocation
entirely while the fallback was counting `st_size` as apparent size, and the
two disagreed on every directory in the fixture.

## 6. Symlinks are measured, never followed

`DirEntry::metadata` is `lstat` on Unix, so a symlink is counted as the link
itself. Following them would double-count every target and can cycle.

## 7. What could not be read is counted, not dropped

Every directory that returns `EPERM`/`EACCES` increments a counter and gets the
`UNREADABLE` flag. It is surfaced in the UI as its own figure.

This matters because macOS gives no API to *request* Full Disk Access — an app
can only deep-link into System Settings and wait. A scan without it silently
under-reports, and "silently" is the part this rule removes. An unreadable
count is also the most honest possible Full Disk Access prompt: it says exactly
how much is being missed.

## 8. The reconciliation

A scan answers "what is in this folder". It cannot answer *"my disk says
1.4 GB free — where did 245 GB go?"* The bar does, and it sums to the
container's capacity **exactly**:

```
Scanned              163.71 GB   ← this scan, 67% coverage
Elsewhere on Data     56.43 GB   ← same volume, outside the scan
Macintosh HD          11.27 GB   ┐
Preboot                8.84 GB   │ OS-managed: real space,
Recovery               2.29 GB   │ nobody's to clean
VM                     1.07 GB   │
Update                  9.7 MB   ┘
Filesystem overhead   137.3 MB   ← APFS metadata no volume claims
Free                   1.35 GB
─────────────────────────────
TOTAL                245.11 GB   = capacity
```

| Component     | Source                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| capacity/free | `diskutil apfs list -plist` (container ceiling), else `getfsstat`       |
| per-volume    | `diskutil apfs list -plist` — **no public API exists**                  |
| scanned       | the scan, physical bytes                                               |
| snapshots     | `fs_snapshot_list`, across every mounted volume in the container        |
| purgeable     | `volumeAvailableCapacityForImportantUsage` − `volumeAvailableCapacity`  |

Three rules keep it honest.

**It always balances.** A shortfall becomes a labelled `Unaccounted` slice; an
overshoot is trimmed off the largest non-free segment. A bar claiming more than
the size of the disk would discredit everything else in the app.

**Purgeable is an annotation, not a slice.** Those bytes already sit inside some
volume's usage, so drawing them again would double-count. It is reported beside
the bar because it explains why Finder and `df` disagree about free space.

**`statfs` cannot do this.** Every volume in an APFS container returns the
container's numbers — on this machine `/`, `Data`, `Preboot`, `Recovery` and
`VM` all report 245.11 GB capacity and the same free space. Using
`f_blocks - f_bfree` per volume would count the same bytes five times, which is
why the `diskutil` subprocess is worth its fragility. When it fails, the
breakdown degrades to container totals and says so rather than guessing.

### Snapshots are listed per container, not per volume

The snapshots that matter are usually not on the volume you scanned. An
OS-update snapshot lives on the System volume while a home scan sits on Data,
so listing only the scan root's volume reports **zero** snapshots on a machine
that visibly has one. Every mounted volume in the container gets listed.

### Snapshots: list, never delete

`fs_snapshot_list` is unrestricted. `fs_snapshot_create` and
`fs_snapshot_delete` require `com.apple.developer.vfs.snapshot`, which Apple
grants to backup vendors only, after DTS review.

So snapshots are shown and explained, and reclaiming them goes through
`tmutil thinlocalsnapshots`. The app must never imply it can delete a snapshot
directly.

## 9. Units

Sizes are formatted with `.byteCount(style: .file)` — decimal GB, matching
Finder. Users compare our numbers against Finder's constantly; using binary
units would make every figure look subtly wrong even when it is right.

The one exception is **memory** in the system monitor, formatted with
`.byteCount(style: .memory)`: RAM is sold in binary units, and a 16 GB Mac
reported as "17.18 GB of memory" is wrong in the way people notice.

## 10. A total never counts the same bytes twice

Search results, filter totals and the cleanup queue all sum sizes, and each of
them can hold a folder together with something inside it — a folder called
`demo` and the `demo.mp4` it contains, or `node_modules` nested three deep.
Adding both reports more than deleting the whole selection could ever free.

So every total sums **outermost** items only: an item whose ancestor is also
in the set contributes to the count but not to the bytes. The storage map's
filter highlight uses the same rule, with one addition — a folder *inside* a
match has no matched bytes of its own (they were counted at the match above
it), yet it is entirely matched, so the engine reports that separately
(`dm_search_inside`) rather than letting the map draw it dark.

## 11. A folder's kind is a colour, not a fact

Each file has one kind, from where it lives first (anything under `Caches` is
a cache, anything under `node_modules` a dependency) and its extension second.
A folder is coloured by the kind that holds most of its direct children's
bytes, when that kind reaches 30% — otherwise it is "other".

That majority is good enough to colour a rectangle and wrong for anything that
adds up bytes, so it is used for nothing else: `kind:` queries match files and
bundles only, and the "what's on disk" breakdown walks every file rather than
trusting a folder's label.
