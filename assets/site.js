// The building: the lift, the directory board, and each floor's screen.
//
// Every screen shows its finished state without JavaScript. With it, a floor
// plays once when the lift arrives there; motion follows the data — a floor
// is as tall as its bytes, a bar as long as its share — and nothing moves for
// decoration's sake. Reduced-motion visitors get the finished states.

(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const gb = (v) => `${v.toFixed(1)} GB`;

  // ---- downloads -----------------------------------------------------------------

  /** A Drive share link, as a link that downloads the file directly. */
  function driveDirect(url) {
    const id = (url.match(/\/d\/([\w-]{10,})/) || url.match(/[?&]id=([\w-]{10,})/) || [])[1];
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  }

  function wireDownloads() {
    const cfg = window.LEGROOM_DOWNLOADS || {};
    $$("[data-download]").forEach((door) => {
      const kind = door.dataset.download;
      const item = cfg[kind] || {};
      $$(".dl-size", door).forEach((el) => item.size && (el.textContent = `${item.file || ""} · ${item.size}`.replace(/^ · /, "")));
      const link = $(".dl-link", door);
      const pending = $(".pending", door);
      if (!link) return;
      if (item.url) {
        link.href = driveDirect(item.url);
        link.rel = "noopener";
        link.removeAttribute("aria-disabled");
        if (pending) pending.hidden = true;
      } else {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("role", "link");
        if (pending) pending.hidden = false;
      }
    });
    $$("[data-version]").forEach((el) => (el.textContent = cfg.version || el.textContent));
  }

  // ---- the lift ------------------------------------------------------------------

  const ORDER = ["L", "R", "6", "5", "4", "3", "2", "1", "G"];
  const floorPlayers = new Map();
  const played = new Set();

  function initLift() {
    const strip = $(".lift-strip");
    const arrow = $(".lift-arrow");
    if (!strip) return;
    strip.innerHTML = ORDER.map((f) => `<span>${f === "L" ? "·" : f}</span>`).join("");
    const links = $$(".lift a");
    const sections = $$("[data-floor]").filter((s) => s.tagName === "SECTION");
    let current = "L";
    let settle;
    const tourAll = new URLSearchParams(location.search).get("tour") === "all";

    const show = (floor) => {
      if (floor === current) return;
      const from = ORDER.indexOf(current);
      const to = ORDER.indexOf(floor);
      current = floor;
      strip.style.transform = `translateY(${-to * 28}px)`;
      arrow.classList.remove("idle");
      arrow.classList.toggle("down", to > from);
      clearTimeout(settle);
      settle = setTimeout(() => arrow.classList.add("idle"), 900);
      links.forEach((a) => a.setAttribute("aria-current", String(a.dataset.floor === floor)));
      if (!tourAll) sections.forEach((s) => s.classList.toggle("lit", s.dataset.floor === floor));
      if (!played.has(floor) && floorPlayers.has(floor)) {
        played.add(floor);
        floorPlayers.get(floor)();
      }
      document.dispatchEvent(new CustomEvent("floor", { detail: floor }));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) show(e.target.dataset.floor === "lobby" ? "L" : e.target.dataset.floor);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    // `?tour=all`: light every floor and play every screen at once — for
    // full-page screenshots of the site, not for visitors.
    if (tourAll) {
      sections.forEach((s) => s.classList.add("lit"));
      floorPlayers.forEach((play, floor) => (played.add(floor), play()));
      document.dispatchEvent(new CustomEvent("floor", { detail: "1" }));
    }
  }

  // ---- the directory board ---------------------------------------------------------

  // An example 476 GB drive. `reclaim` is what Legroom would suggest clearing.
  const CAPACITY = 476.0;
  const DRIVE = [
    { code: "B", name: "Windows", note: "the foundation", gb: 58.2, c: "var(--system)" },
    { code: "1", name: "Videos", gb: 112.0, c: "var(--video)" },
    { code: "2", name: "Apps & games", gb: 88.0, c: "var(--apps)" },
    { code: "3", name: "Images", gb: 48.2, c: "var(--image)" },
    { code: "4", name: "Caches", gb: 31.7, c: "var(--cache)", reclaim: 24.1 },
    { code: "5", name: "Developer", gb: 22.5, c: "var(--developer)", reclaim: 9.2 },
    { code: "6", name: "Archives & installers", gb: 18.9, c: "var(--archive)", reclaim: 3.4 },
    { code: "7", name: "Documents", gb: 9.6, c: "var(--document)" },
    { code: "8", name: "Audio", gb: 7.4, c: "var(--audio)" },
    { code: "9", name: "AI models", gb: 4.1, c: "var(--model)" },
    { code: "10", name: "Other", gb: 53.3, c: "var(--other)" },
    { code: "11", name: "Recycle Bin", note: "deleted, not gone", gb: 12.3, c: "#c8ccd2", reclaim: 12.3 },
    { code: "—", name: "Free", gb: 9.8, vacant: true },
  ];
  const RECLAIM = DRIVE.reduce((t, f) => t + (f.reclaim || 0), 0);

  function initBoard() {
    const board = $("#board");
    if (!board) return;
    const elevation = $(".elevation", board);
    const directory = $(".directory", board);
    const total = $(".total", board);
    const here = $(".here-line", board);

    // Elevation: ground floor first (the column stacks upward).
    elevation.innerHTML = DRIVE.map(
      (f, i) =>
        `<div class="storey${f.vacant ? " vacant" : ""}" data-i="${i}" style="--c:${f.c || "transparent"};--share:${f.gb / CAPACITY}">${
          f.reclaim ? `<div class="reclaim" style="--r:${f.reclaim / f.gb}"></div>` : ""
        }</div>`,
    ).join("");
    // Directory: top floor first, as a board reads.
    directory.innerHTML = [...DRIVE]
      .map((f, i) => ({ f, i }))
      .reverse()
      .map(
        ({ f, i }) =>
          `<li data-i="${i}" class="${f.vacant ? "vacant" : ""}" style="--c:${f.c || "transparent"}"><span class="band">${f.code}</span><span class="name">${f.name}${
            f.note ? `<small>${f.note}</small>` : ""
          }${f.vacant ? `<span class="here-pill">You are here</span>` : ""}</span><span class="size num"><span class="now">${gb(f.gb)}</span><span class="was">${gb(f.gb)}</span></span></li>`,
      )
      .join("");

    const storeys = $$(".storey", elevation);
    const rows = $$("li", directory);

    // Hovering a floor in either place picks it out in both.
    const focus = (i) => {
      storeys.forEach((s) => s.classList.toggle("dimmed", i !== null && s.dataset.i !== String(i)));
      rows.forEach((r) => r.classList.toggle("dim", i !== null && r.dataset.i !== String(i)));
    };
    [...storeys, ...rows].forEach((el) => {
      el.addEventListener("mouseenter", () => focus(Number(el.dataset.i)));
      el.addEventListener("mouseleave", () => focus(null));
    });

    // "You are here" sits on the free space: the line where the building stops.
    const placeHere = (freeGb) => {
      here.style.top = `${elevation.offsetHeight * (freeGb / CAPACITY)}px`;
    };

    const setState = (after) => {
      board.classList.toggle("after", after);
      $$(".toggle button", board).forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.state === "after") === after)));
      DRIVE.forEach((f, i) => {
        const now = after ? (f.vacant ? f.gb + RECLAIM : f.gb - (f.reclaim || 0)) : f.gb;
        const storey = storeys[i];
        storey.style.setProperty("--share", String(now / CAPACITY));
        const row = rows.find((r) => r.dataset.i === String(i));
        $(".now", row).textContent = gb(now);
      });
      placeHere(after ? DRIVE[DRIVE.length - 1].gb + RECLAIM : DRIVE[DRIVE.length - 1].gb);
      const note = $(".board-note", board);
      note.innerHTML = after
        ? `After review and removal: <b>${gb(DRIVE[DRIVE.length - 1].gb + RECLAIM)}</b> free instead of <b>${gb(DRIVE[DRIVE.length - 1].gb)}</b>. Everything else is exactly where it was.`
        : `Hatched: <b>${gb(RECLAIM)}</b> Legroom would suggest clearing — caches, old installers, build files and the Recycle Bin.`;
    };
    $$(".toggle button", board).forEach((b) => b.addEventListener("click", () => setState(b.dataset.state === "after")));
    window.addEventListener("resize", () => placeHere(board.classList.contains("after") ? DRIVE[DRIVE.length - 1].gb + RECLAIM : DRIVE[DRIVE.length - 1].gb));

    // Construction: floors rise from the ground in proportion to their bytes,
    // the balance counts up to the capacity, then the reclaimable share shows.
    (async () => {
      here.style.opacity = "0";
      if (!reduce) {
        storeys.forEach((s) => (s.style.height = "0"));
        void elevation.offsetHeight;
      }
      let sum = 0;
      for (let i = 0; i < DRIVE.length; i++) {
        storeys[i].style.height = "";
        sum += DRIVE[i].gb;
        total.textContent = gb(sum);
        await wait(110);
      }
      total.textContent = gb(CAPACITY);
      board.classList.add("balanced");
      await wait(700);
      board.classList.add("show-reclaim");
      placeHere(DRIVE[DRIVE.length - 1].gb);
      here.style.opacity = "1";
    })();
  }

  // ---- R · scanning ------------------------------------------------------------------

  floorPlayers.set("R", async () => {
    const s = $('[data-screen="scan"]');
    const arc = $(".arc", s);
    const pct = $(".pct", s);
    const records = $(".records", s);
    const secs = $(".secs", s);
    const modes = $$(".scan-modes .card", s);
    const C = 364.4;
    const FOUND = 4966331;
    modes[1].classList.remove("on");
    await wait(300);
    modes[1].classList.add("on");
    // 21.5 seconds of real time, told in 2.4.
    const start = performance.now();
    const dur = reduce ? 0 : 2400;
    await new Promise((done) => {
      const step = (t) => {
        const k = dur ? Math.min(1, (t - start) / dur) : 1;
        const e = 1 - Math.pow(1 - k, 2.2);
        arc.style.strokeDashoffset = String(C * (1 - e));
        pct.textContent = `${Math.round(e * 100)}%`;
        records.textContent = Math.round(e * FOUND).toLocaleString("en-US");
        secs.textContent = (e * 21.5).toFixed(1);
        k < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
  });

  // ---- 6 · overview --------------------------------------------------------------------

  const RECON = [
    { label: "Your files", gb: 395.7, c: "#3b82f5" },
    { label: "Windows", gb: 58.2, c: "rgba(240,241,243,.42)" },
    { label: "Recycle Bin", gb: 12.3, c: "#fa9e33" },
    { label: "Free", gb: 9.8, c: "rgba(64,199,120,.55)" },
  ];

  function initOverview() {
    const s = $('[data-screen="overview"]');
    if (!s) return;
    $(".recon-bar", s).innerHTML = RECON.map((r) => `<span style="background:${r.c};width:${(r.gb / CAPACITY) * 100}%" title="${r.label}: ${gb(r.gb)}"></span>`).join("");
    $(".recon-legend", s).innerHTML =
      RECON.map((r) => `<div><i style="background:${r.c}"></i>${r.label}<span class="n">${gb(r.gb)}</span></div>`).join("") +
      `<div style="grid-column:1/-1;border-top:1px solid rgba(255,255,255,.1);padding-top:6px;margin-top:2px"><b>Adds up to</b><span class="n"><b style="color:#f0f1f3">${gb(CAPACITY)}</b> = capacity</span></div>`;
    $$(".finding", s).forEach((f) => $(".tick", f).classList.add("on"));
  }

  floorPlayers.set("6", async () => {
    const s = $('[data-screen="overview"]');
    const bars = $$(".recon-bar span", s);
    const findings = $$(".finding", s);
    if (!reduce) {
      bars.forEach((b) => ((b.dataset.w = b.style.width), (b.style.width = "0")));
      findings.forEach((f) => {
        $(".tick", f).classList.remove("on");
        f.classList.remove("on");
      });
      void s.offsetHeight;
    }
    for (const b of bars) {
      b.style.width = b.dataset.w || b.style.width;
      await wait(260);
    }
    await wait(500);
    for (const f of findings) {
      $(".tick", f).classList.add("on");
      f.classList.add("on");
      await wait(420);
    }
  });

  // ---- 5 · storage map -------------------------------------------------------------------

  const AGE = ["#fa7317", "#f59e0a", "#85cc17", "#14b8a6", "#3b82f5", "#6366f2"];
  const fill = (hex) => {
    const v = parseInt(hex.slice(1), 16);
    const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => Math.round(c * 0.72));
    return `rgb(${ch.join(",")})`;
  };
  const HOME = [
    { name: "Videos", gb: 112, kind: "#3d85f5", age: 2, kids: [
      { name: "Holiday 2024", gb: 38.2, kind: "#3d85f5", age: 1 },
      { name: "Family", gb: 27.4, kind: "#3d85f5", age: 4 },
      { name: "Recordings", gb: 21.5, kind: "#3d85f5", age: 2 },
      { name: "Edits", gb: 14.6, kind: "#3d85f5", age: 3 },
      { name: "Screen captures", gb: 6.1, kind: "#3d85f5", age: 0 },
      { name: "184 smaller items", gb: 4.2, kind: "#78808f", age: 5, agg: true },
    ] },
    { name: "Games", gb: 71.4, kind: "#21add6", age: 1 },
    { name: "Pictures", gb: 48.2, kind: "#f58c33", age: 3 },
    { name: "AppData", gb: 31.7, kind: "#21a89e", age: 0 },
    { name: "Projects", gb: 22.5, kind: "#33b86e", age: 4 },
    { name: "Downloads", gb: 18.9, kind: "#e65454", age: 5 },
    { name: "Other", gb: 12.0, kind: "#78808f", age: 5 },
    { name: "Documents", gb: 9.6, kind: "#946bed", age: 3 },
    { name: "Music", gb: 7.4, kind: "#e8579c", age: 5 },
    { name: "Models", gb: 4.1, kind: "#e6b829", age: 2 },
  ];

  /** Squarified treemap: rectangles near square, areas exactly proportional. */
  function squarify(items, x, y, w, h) {
    const out = [];
    let rest = items.slice().sort((a, b) => b.gb - a.gb);
    while (rest.length) {
      const total = rest.reduce((t, i) => t + i.gb, 0);
      const scale = (w * h) / total;
      const side = Math.min(w, h);
      let row = [];
      let best = Infinity;
      for (const item of rest) {
        const next = [...row, item];
        const s = next.reduce((t, i) => t + i.gb * scale, 0);
        const worst = Math.max(...next.map((i) => {
          const a = i.gb * scale;
          return Math.max((side * side * a) / (s * s), (s * s) / (side * side * a));
        }));
        if (worst > best) break;
        best = worst;
        row = next;
      }
      rest = rest.slice(row.length);
      const s = row.reduce((t, i) => t + i.gb * scale, 0);
      const thick = s / side;
      let off = 0;
      for (const item of row) {
        const len = (item.gb * scale) / thick;
        out.push(w >= h ? { item, x, y: y + off, w: thick, h: len } : { item, x: x + off, y, w: len, h: thick });
        off += len;
      }
      if (w >= h) {
        x += thick;
        w -= thick;
      } else {
        y += thick;
        h -= thick;
      }
    }
    return out;
  }

  function initMap() {
    const s = $('[data-screen="map"]');
    if (!s) return;
    const map = $(".map", s);
    let mode = "kind";
    let tiles = [];

    const color = (item) => fill(mode === "kind" ? item.kind : AGE[item.age]);
    const place = (el, r, W, H) => {
      el.style.left = `${(r.x / W) * 100}%`;
      el.style.top = `${(r.y / H) * 100}%`;
      el.style.width = `${(r.w / W) * 100}%`;
      el.style.height = `${(r.h / H) * 100}%`;
    };
    const label = (r) => (r.w > 64 && r.h > 32 ? `<span class="t">${r.item.name}<small class="num">${r.item.gb.toFixed(1)} GB</small></span>` : r.w > 50 && r.h > 18 ? `<span class="t">${r.item.name}</span>` : "");

    const draw = (items, grow) => {
      const W = map.clientWidth || 600;
      const H = map.clientHeight || 330;
      const rects = squarify(items, 0, 0, W, H);
      map.innerHTML = "";
      tiles = rects.map((r) => {
        const el = document.createElement("div");
        el.className = "tile";
        el.innerHTML = label(r);
        el.style.backgroundColor = color(r.item);
        if (r.item.agg) el.style.backgroundImage = "repeating-linear-gradient(135deg,rgba(255,255,255,.06) 0 4px,transparent 4px 8px)";
        if (grow && !reduce) {
          place(el, { x: r.x + r.w / 2, y: r.y + r.h / 2, w: 0, h: 0 }, W, H);
          el.style.opacity = "0";
        } else place(el, r, W, H);
        map.appendChild(el);
        return { el, r, W, H };
      });
      if (grow && !reduce) {
        void map.offsetHeight;
        tiles.forEach((t, i) =>
          setTimeout(() => {
            place(t.el, t.r, t.W, t.H);
            t.el.style.opacity = "1";
          }, i * 70),
        );
      }
    };
    const recolor = () => tiles.forEach((t) => (t.el.style.backgroundColor = color(t.r.item)));
    const setMode = (m) => {
      mode = m;
      $$(".mode-chips span", s).forEach((c) => c.classList.toggle("on", c.dataset.mode === m));
      recolor();
    };

    draw(HOME, false);
    let zoomed = false;
    window.addEventListener("resize", () => draw(zoomed ? HOME[0].kids : HOME, false));
    $$(".mode-chips span", s).forEach((c) => c.addEventListener("click", () => setMode(c.dataset.mode)));

    floorPlayers.set("5", async () => {
      draw(HOME, true);
      await wait(1900);
      setMode("age");
      await wait(1800);
      setMode("kind");
      await wait(700);
      // Into Videos: the tile opens out to the whole map, then its contents land.
      const videos = tiles.find((t) => t.r.item.name === "Videos");
      tiles.forEach((t) => t !== videos && (t.el.style.opacity = "0"));
      if (videos) place(videos.el, { x: 0, y: 0, w: videos.W, h: videos.H }, videos.W, videos.H);
      $(".crumb-2", s).innerHTML = `› <b>Videos</b>`;
      await wait(900);
      zoomed = true;
      draw(HOME[0].kids, true);
    });
  }

  // ---- 4 · search & filters ----------------------------------------------------------------

  const HITS = [
    { name: "Holiday 2024 — full.mp4", where: "~\\Videos\\Holiday 2024", gb: 9.8 },
    { name: "wedding-4k.mov", where: "~\\Videos\\Family", gb: 8.1 },
    { name: "Recording 2025-03-11.mkv", where: "~\\Videos\\Recordings", gb: 6.9 },
    { name: "Family reunion.mp4", where: "~\\Videos\\Family", gb: 6.2 },
    { name: "Edit master v3.mov", where: "~\\Videos\\Edits", gb: 5.6 },
    { name: "Screen capture.mp4", where: "~\\Desktop", gb: 4.7 },
  ];
  const FILTERS = [
    ["Videos", 112.0],
    ["Games", 71.4],
    ["Temp, logs & caches", 24.1],
    ["Archives & installers", 18.9],
    ["Old downloads", 6.2],
    ["AI models", 4.1],
  ];

  function initFind() {
    const s = $('[data-screen="find"]');
    if (!s) return;
    const max = HITS[0].gb;
    $(".rlist", s).innerHTML = HITS.map(
      (h) => `<div class="row"><span class="ico" style="--t:#3d85f5"></span><div class="grow"><b>${h.name}</b><span>${h.where}</span></div><div><div class="size">${gb(h.gb)}</div><div class="bar" style="width:${(h.gb / max) * 100}%"></div></div></div>`,
    ).join("");
    $(".filters", s).innerHTML = FILTERS.map(([n, v], i) => `<span class="${i === 0 ? "on" : ""}">${n}<em>${v.toFixed(1)} GB</em></span>`).join("");
  }

  floorPlayers.set("4", async () => {
    const s = $('[data-screen="find"]');
    const typed = $(".typed", s);
    const rows = $$(".rlist .row", s);
    const count = $(".rcount", s);
    const total = $(".rtotal", s);
    const chips = $$(".filters span", s);
    const query = "kind:video >1GB";
    if (!reduce) {
      typed.textContent = "";
      rows.forEach((r) => ((r.style.opacity = "0"), (r.style.transform = "translateY(6px)")));
      count.textContent = "Searching…";
      total.textContent = "";
      chips.forEach((c) => c.classList.remove("on"));
    }
    for (let i = 1; i <= query.length; i++) {
      typed.textContent = query.slice(0, i);
      await wait(70);
    }
    await wait(250);
    let sum = 0;
    for (const [i, r] of rows.entries()) {
      r.style.opacity = "1";
      r.style.transform = "none";
      sum += HITS[i].gb;
      count.textContent = `${i + 1} match${i ? "es" : ""}`;
      total.textContent = `· ${gb(sum)}`;
      await wait(150);
    }
    await wait(500);
    chips[0].classList.add("on");
  });

  // ---- 3 · safe cleanup -------------------------------------------------------------------

  floorPlayers.set("3", async () => {
    const s = $('[data-screen="cleanup"]');
    const sheet = $(".sheet", s);
    const review = $(".review-btn", s);
    const move = $(".move-btn", s);
    const stamp = $(".stamp", s);
    if (!reduce) {
      sheet.classList.add("closed");
      await wait(600);
      review.classList.add("pressed");
      await wait(180);
      review.classList.remove("pressed");
    }
    sheet.classList.remove("closed");
    await wait(1500);
    move.classList.add("pressed");
    await wait(200);
    move.classList.remove("pressed");
    // The mark lands once, and stays.
    stamp.classList.add("landed");
  });

  // ---- 2 · applications ---------------------------------------------------------------------

  floorPlayers.set("2", async () => {
    const s = $('[data-screen="apps"]');
    const row = $(".app-row.target", s);
    const btn = $(".uninstall", s);
    const sub = $(".sub", s);
    await wait(1100);
    btn.classList.add("pressed");
    await wait(180);
    btn.classList.remove("pressed");
    row.classList.add("busy");
    btn.textContent = "Uninstalling…";
    await wait(1600);
    row.classList.add("gone");
    await wait(500);
    row.hidden = true;
    sub.textContent = "4 apps · 87.8 GB measured";
  });

  // ---- 1 · system monitor ---------------------------------------------------------------------

  function initMonitor() {
    const s = $('[data-screen="monitor"]');
    if (!s) return;
    const N = 60;
    const series = { cpu: [], mem: [], disk: [], net: [] };
    const walk = (prev, lo, hi, step) => Math.max(lo, Math.min(hi, prev + (Math.random() - 0.5) * step));
    let cpu = 31, mem = 62, disk = 12, net = 4.2;
    for (let i = 0; i < N; i++) {
      cpu = walk(cpu, 6, 88, 18);
      mem = walk(mem, 58, 68, 1.6);
      disk = walk(disk, 0, 70, 22);
      net = walk(net, 0.2, 40, 6);
      series.cpu.push(cpu);
      series.mem.push(mem);
      series.disk.push(disk);
      series.net.push(net);
    }
    const cores = $(".cores", s);
    cores.innerHTML = Array.from({ length: 12 }, () => "<i></i>").join("");
    const PROCS = [
      ["Browser", 0, 1.9],
      ["Video Editor Pro", 0, 2.4],
      ["Game Launcher", 0, 0.6],
      ["Legroom", 0, 0.12],
      ["Explorer", 0, 0.18],
      ["Antivirus service", 0, 0.31],
    ];
    const plist = $(".plist", s);

    const draw = (canvas, data, max, color) => {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth || 300;
      const h = canvas.clientHeight || 46;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75].forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(0, h * f);
        ctx.lineTo(w, h * f);
        ctx.stroke();
      });
      const pts = data.map((v, i) => [(i / (N - 1)) * w, h - (Math.min(v, max) / max) * (h - 3) - 1.5]);
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = color + "29";
      ctx.fill();
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    };

    const tick = () => {
      cpu = walk(cpu, 6, 88, 18);
      mem = walk(mem, 58, 68, 1.6);
      disk = walk(disk, 0, 70, 22);
      net = walk(net, 0.2, 40, 6);
      for (const [k, v] of Object.entries({ cpu, mem, disk, net })) {
        series[k].push(v);
        series[k].shift();
      }
      draw($(".cpu-spark", s), series.cpu, 100, "#3b82f5");
      draw($(".mem-spark", s), series.mem, 100, "#946bed");
      draw($(".disk-spark", s), series.disk, 100, "#33b86e");
      draw($(".net-spark", s), series.net, Math.max(8, ...series.net), "#f58c33");
      $(".cpu-v", s).textContent = `${Math.round(cpu)}%`;
      $(".mem-v", s).textContent = `${Math.round(mem)}%`;
      $(".disk-v", s).textContent = `${Math.round(disk)}%`;
      $(".net-v", s).textContent = `${net.toFixed(1)} Mbps`;
      $(".m-use", s).style.width = `${mem}%`;
      $$("i", cores).forEach((c) => c.style.setProperty("--h", `${Math.max(4, Math.min(100, cpu + (Math.random() - 0.5) * 60))}%`));
      PROCS.forEach((p, i) => (p[1] = Math.max(0, (i === 3 ? 0.4 : 0) + Math.random() * (cpu / (i + 1.4)) * 0.6)));
      plist.innerHTML = [...PROCS]
        .sort((a, b) => b[1] - a[1])
        .map(([n, c, m]) => `<div class="p"><span>${n}</span><span><span class="hot" style="--heat:${Math.min(1, c / 25)}">${c.toFixed(1)}%</span></span><span>${m >= 1 ? m.toFixed(2) + " GB" : Math.round(m * 1024) + " MB"}</span></div>`)
        .join("");
    };
    tick();

    // Live only while the floor is lit and the tab is visible.
    let timer = null;
    let lit = false;
    const run = () => {
      const want = lit && !document.hidden;
      if (want && !timer) timer = setInterval(tick, reduce ? 2000 : 1000);
      if (!want && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    document.addEventListener("floor", (e) => {
      lit = e.detail === "1";
      run();
    });
    document.addEventListener("visibilitychange", run);
  }

  // ---- go -----------------------------------------------------------------------------

  wireDownloads();
  initBoard();
  initOverview();
  initMap();
  initFind();
  initMonitor();
  initLift();
})();
