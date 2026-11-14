/* Atlas: legend bottom sheet (mobile), mini-legend contents with scrollspy, release ETA. */
(function (d, w) {
  var root = d.documentElement;
  root.setAttribute("data-js", "");

  var btn = d.querySelector("[data-sheet-btn]"), sheet = d.getElementById("atlas-legend"),
    scrim = d.querySelector("[data-scrim]"), x = d.querySelector("[data-sheet-close]");
  function isOpen() { return root.hasAttribute("data-sheet"); }
  function focusables() { return [].slice.call(sheet.querySelectorAll("a[href],button:not([hidden])")); }
  function set(open, back) {
    btn.setAttribute("aria-expanded", String(open));
    if (open) root.setAttribute("data-sheet", "open"); else root.removeAttribute("data-sheet");
    scrim.hidden = !open;
    if (open) (sheet.querySelector("[aria-current]") || x || sheet).focus();
    else if (back) btn.focus();
  }
  if (btn && sheet && scrim) {
    btn.hidden = false;
    if (x) { x.hidden = false; x.addEventListener("click", function () { set(false, 1); }); }
    btn.addEventListener("click", function () { set(!isOpen()); });
    scrim.addEventListener("click", function () { set(false, 1); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a") && isOpen()) set(false); });
    d.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { set(false, 1); return; }
      if (e.key !== "Tab") return;
      var f = focusables(), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    var mq = w.matchMedia("(min-width: 64em)");
    if (mq.addEventListener) mq.addEventListener("change", function () { if (isOpen()) set(false); });
  }

  /* contents: one entry per h2 of the article */
  var toc = d.querySelector("[data-toc]"), hs = [].slice.call(d.querySelectorAll(".ja-prose h2"));
  if (toc && hs.length > 1) {
    var ol = toc.querySelector("ol"), links = [];
    hs.forEach(function (h, i) {
      if (!h.id) {
        var id = (h.textContent.normalize ? h.textContent.normalize("NFD") : h.textContent).replace(/[̀-ͯ]/g, "")
          .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "s" + (i + 1);
        if (d.getElementById(id)) id += "-" + (i + 1);
        h.id = id;
      }
      var li = d.createElement("li"), a = d.createElement("a");
      a.href = "#" + h.id; a.textContent = h.textContent;
      li.appendChild(a); ol.appendChild(li); links.push(a);
    });
    toc.hidden = false;
    if ("IntersectionObserver" in w) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          links[hs.indexOf(e.target)].setAttribute("aria-current", "true");
        });
      }, { rootMargin: "0px 0px -72% 0px" });
      hs.forEach(function (h) { io.observe(h); });
    }
  }

  /* wide tables: make the scroll box reachable by keyboard */
  [].forEach.call(d.querySelectorAll(".ja-table-wrap"), function (t) { if (t.scrollWidth > t.clientWidth) t.tabIndex = 0; });

  /* release ETA (static dashes stay without JS) */
  var eta = d.querySelector("[data-release]"), t = eta && Date.parse(eta.getAttribute("data-release"));
  if (!t) return;
  function q(s) { return eta.querySelector(s); }
  (function tick() {
    var s = Math.floor((t - Date.now()) / 1000);
    if (s <= 0) { q("[data-eta-row]").hidden = true; q("[data-eta-done]").hidden = false; return; }
    q("[data-d]").textContent = Math.floor(s / 86400);
    q("[data-h]").textContent = Math.floor(s % 86400 / 3600);
    q("[data-m]").textContent = Math.floor(s % 3600 / 60);
    setTimeout(tick, 30000);
  })();
})(document, window);
