/* Lomeone design mock · 공용 스크립트
   - 시안용 보조 코드입니다. 실제 구현은 React 컴포넌트(C-xx)로 옮기세요.
   - 아이콘 / 헤더(C-01) / 푸터(C-02) / 토스트(C-14) / 시트(C-15) / 테마·브랜드 미리보기 */
(function () {
  const q = new URLSearchParams(location.search);
  const root = document.documentElement;

  /* 테마·브랜드 미리보기: ?theme=dark  ?brand=b  (페이지 이동 시 유지) */
  ["theme", "brand"].forEach((k) => {
    let v = q.get(k);
    try { if (v) sessionStorage.setItem("lm-" + k, v); else v = sessionStorage.getItem("lm-" + k); } catch (e) {}
    if (v && v !== "auto" && v !== "a") root.setAttribute("data-" + k, v);
  });
  /* 다크 모드: color-scheme / theme-color 메타 */
  [["color-scheme", "light dark", ""], ["theme-color", "#FFFFFF", "(prefers-color-scheme: light)"], ["theme-color", "#0F1514", "(prefers-color-scheme: dark)"]].forEach(([n, c, m]) => {
    const e = document.createElement("meta"); e.name = n; e.content = c; if (m) e.media = m; document.head.appendChild(e);
  });
  window.lmPrefs = (k, v) => {
    try { sessionStorage.setItem("lm-" + k, v); } catch (e) {}
    if (v === "auto" || v === "a") root.removeAttribute("data-" + k); else root.setAttribute("data-" + k, v);
  };

  /* 아이콘 (24px 그리드, 선 1.75px) */
  const P = {
    back: "m15 5-7 7 7 7", close: "M6 6l12 12M18 6 6 18", share: "M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5",
    copy: "M9 9h10v11H9zM5 15V4h10", link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    key: "M14 10a4 4 0 1 0-3.9 4L21 14v-3h-3v-2M7.5 10h.01", cal: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4", check: "m5 12 5 5 9-10",
    pencil: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4", more: "M5 12h.01M12 12h.01M19 12h.01", user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2", left: "m15 5-7 7 7 7", right: "m9 5 7 7-7 7", warn: "M12 4 2.5 20h19zM12 10v4M12 17h.01",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01", trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13", chat: "M4 5h16v11H9l-5 4z", plus: "M12 5v14M5 12h14",
    lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3", up: "m5 15 7-7 7 7"
  };
  window.icon = (n, extra = "") => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || ""}"/></svg>`;
  window.lmSymbol = (s = 28) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="lmc"><circle cx="11.5" cy="16" r="9"/></clipPath></defs><circle cx="11.5" cy="16" r="9" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="20.5" cy="16" r="9" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="20.5" cy="16" r="9" fill="var(--accent)" clip-path="url(#lmc)"/></svg>`;
  const logo = `<a class="logo" href="home.html" aria-label="로미원 홈" translate="no">${window.lmSymbol()}<span>lomeone</span><span class="ko">로미원</span></a>`;

  document.querySelectorAll("[data-icon]").forEach((el) => { el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)); });

  /* C-01 SiteHeader : default | compact | back */
  const h = document.querySelector("[data-header]");
  if (h) {
    const v = h.dataset.header, t = h.dataset.title || "", right = h.dataset.right || "";
    let inner = "";
    if (v === "default") inner = `${logo}<nav><a class="link-btn" href="my.html">내 모임</a><a class="btn primary" href="new.html" style="min-height:40px">만들기</a></nav>`;
    else if (v === "compact") inner = `${logo}<nav>${right}</nav>`;
    else inner = `<a class="icon-btn" href="${h.dataset.href || "javascript:history.back()"}" aria-label="뒤로">${icon("back")}</a><div class="title">${t}</div><nav>${right}</nav>`;
    h.outerHTML = `<header class="site-header"><div class="wrap inner">${inner}</div></header>`;
  }

  /* 본문 바로가기 (키보드 사용자) */
  const mainEl = document.querySelector("main");
  if (mainEl) { mainEl.id = mainEl.id || "main"; mainEl.tabIndex = -1; document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#${mainEl.id}">본문 바로가기</a>`); }

  /* C-02 SiteFooter */
  const f = document.querySelector("[data-footer]");
  if (f) f.outerHTML = `<footer class="site-footer"><div class="wrap"><div class="logo" style="font-size:16px">${window.lmSymbol(22)}<span>lomeone</span></div>
    <div class="links"><a href="home.html#soon">도구</a><a href="about.html">소개</a><a href="about.html?doc=privacy">개인정보처리방침</a><a href="about.html?doc=terms">이용약관</a><a href="mailto:hello@lomeone.com">문의</a></div>
    <div>© Lomeone · 모임의 귀찮은 일을 링크 하나로</div></div></footer>`;

  /* C-14 Toast */
  let tt;
  window.toast = (msg) => {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 3000);
  };

  /* C-15 Sheet : [data-open="#id"]  [data-close] */
  const sc = () => document.querySelector(".scrim") || (() => { const e = document.createElement("div"); e.className = "scrim"; document.body.appendChild(e); return e; })();
  /* 시트가 열리면 배경은 inert(포커스·스크린리더 차단 = 포커스 트랩), 닫히면 열었던 요소로 포커스 복귀. 시트 자체에 포커스(첫 버튼 강조 방지) */
  let opener = null;
  window.openSheet = (id) => {
    const s = document.querySelector(id); if (!s) return; closeSheets(true);
    opener = document.activeElement; s.classList.add("open"); sc().classList.add("open");
    document.querySelectorAll(".page").forEach((p) => (p.inert = true)); s.tabIndex = -1; setTimeout(() => s.focus({ preventScroll: true }), 30);
  };
  window.closeSheets = (keep) => {
    document.querySelectorAll(".sheet.open").forEach((s) => s.classList.remove("open")); sc().classList.remove("open");
    document.querySelectorAll(".page").forEach((p) => (p.inert = false));
    if (!keep && opener && opener.isConnected) { opener.focus({ preventScroll: true }); opener = null; }
  };
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); openSheet(o.dataset.open); return; }
    if (e.target.closest("[data-close]") || e.target.classList.contains("scrim")) { closeSheets(); return; }
    const c = e.target.closest("[data-copy]");
    if (c) {
      const label = c.textContent; c.textContent = "복사됨 ✓"; setTimeout(() => (c.textContent = label), 2000); toast(c.dataset.copy); }
    const t = e.target.closest("[data-toast]"); if (t) toast(t.dataset.toast);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheets(); });

  /* 인앱 브라우저 높이 미리보기: ?inapp=1  → 상하단 카톡 바 흉내 (보이는 높이 약 580px) */
  if (q.get("inapp")) {
    const st = document.createElement("style");
    st.textContent = "body{padding-top:44px;padding-bottom:48px}body::before,body::after{content:'';position:fixed;left:0;right:0;z-index:99;background:#FEE500;opacity:.9}body::before{top:0;height:44px}body::after{bottom:0;height:48px}.site-header{top:44px}.submit-bar{bottom:48px}";
    document.head.appendChild(st);
  }

  /* 확정 축하 효과 (D-10: 1회, reduced-motion 시 CSS로 숨김) */
  window.confetti = (el) => {
    if (!el) return; const cols = ["#fff", "#FEE500", "#9AF0E0", "#FFB4A8"];
    el.innerHTML = Array.from({ length: 22 }, (_, i) => `<i style="left:${(i * 4.6 + 3) % 100}%;background:${cols[i % 4]};animation-delay:${(i % 7) * 60}ms"></i>`).join("");
  };
})();
